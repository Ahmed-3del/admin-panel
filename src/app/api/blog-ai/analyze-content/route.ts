import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Access your API key as an environment variable
const GEMINI_API_KEY = "AIzaSyA6r7xlH65CaS4e3KcMJpi2zGd_QHCu4nw"; // Or process.env.GEMINI_API_KEY if not public

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks
  text = text.replace(/```json\s*/g, '');
  text = text.replace(/```\s*$/g, '');

  // Find JSON object in the text
  const jsonMatch = text.match(/\{.*\}/s);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Analyze the following content and extract structured blog information. Generate both Arabic and English versions for all text fields.
    
    Content to analyze:
    ${content}
    
    Please provide a JSON response with the following structure:
    {
        "titleAr": "Arabic title (max 100 characters)",
        "titleEn": "English title (max 100 characters)",
        "descriptionAr": "Arabic description (max 300 characters)",
        "descriptionEn": "English description (max 300 characters)",
        "contentAr": "Full Arabic content",
        "contentEn": "Full English content",
        "author": "Suggested author name",
        "categories": ["category1", "category2", "category3"],
        "sections": [
            {
                "titleAr": "Arabic section title",
                "titleEn": "English section title",
                "descriptionAr": "Arabic section description",
                "descriptionEn": "English section description",
                "alt": {
                    "en": "English alt text for section image",
                    "ar": "Arabic alt text for section image"
                }
            }
        ],
        "tags": [
            {
                "nameAr": "Arabic tag name",
                "nameEn": "English tag name"
            }
        ],
        "altText": {
            "en": "English alt text for main image",
            "ar": "Arabic alt text for main image"
        },
        "seo": [
            {
                "language": "en",
                "metaTitle": "SEO optimized title for English",
                "metaDescription": "SEO optimized description for English",
                "keywords": "keyword1, keyword2, keyword3",
                "canonicalTag": "https://yourwebsite.com/blog/post-slug",
                "structuredData": {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": "Service or blog post name",
                    "description": "Service or blog post description",
                    "provider": {
                        "@type": "Organization",
                        "name": "Your Company",
                        "url": "https://yourwebsite.com"
                    }
                }
            },
            {
                "language": "ar",
                "metaTitle": "SEO optimized title for Arabic",
                "metaDescription": "SEO optimized description for Arabic",
                "keywords": "كلمة مفتاحية1, كلمة مفتاحية2, كلمة مفتاحية3",
                "canonicalTag": "https://yourwebsite.com/blog/post-slug",
                "structuredData": {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": "اسم الخدمة أو المقال",
                    "description": "وصف الخدمة أو المقال",
                    "provider": {
                        "@type": "Organization",
                        "name": "Your Company",
                        "url": "https://yourwebsite.com"
                    }
                }
            }
        ]
    }
    
    Guidelines:
    - If content is in Arabic, prioritize Arabic fields and translate to English
    - If content is in English, prioritize English fields and translate to Arabic
    - Generate 3-5 relevant categories
    - Create 2-4 sections if the content is long enough
    - Generate exactly 4 relevant tags
    - MUST generate comprehensive SEO data for BOTH English and Arabic languages
    - SEO metaTitle should be different from the main title and optimized for search engines
    - SEO metaDescription should be compelling and include relevant keywords
    - Keywords should be comma-separated and relevant to the content
    - canonicalTag should be a proper URL format (use placeholder domain if needed)
    - structuredData MUST include all required fields with proper schema.org format
    - For structuredData, use "Service" type for service-related content, "Article" for blog posts
    - Ensure all translations are accurate and natural
    - Make sure SEO fields are optimized for search engines and user engagement
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJsonResponse(text);

    try {
      const blogData = JSON.parse(jsonText);
      
      // Validate and ensure SEO data structure is correct
      if (blogData.seo && Array.isArray(blogData.seo)) {
        blogData.seo = blogData.seo.map((seoItem: any) => ({
          language: seoItem.language || "en",
          metaTitle: seoItem.metaTitle || "",
          metaDescription: seoItem.metaDescription || "",
          keywords: seoItem.keywords || "",
          canonicalTag: seoItem.canonicalTag || "",
          structuredData: seoItem.structuredData || {
            "@context": "https://schema.org",
            "@type": "Service",
            name: seoItem.metaTitle || "",
            description: seoItem.metaDescription || "",
            provider: {
              "@type": "Organization",
              name: "Your Company",
              url: seoItem.canonicalTag || "",
            },
          },
        }));
      }
      
      return NextResponse.json(blogData);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return NextResponse.json(
        {
          error: 'Failed to parse AI response',
          raw_response: text,
          cleaned_response: jsonText,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}

