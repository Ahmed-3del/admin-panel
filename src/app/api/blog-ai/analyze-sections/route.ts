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
    Analyze the following content and extract structured sections information only. Generate both Arabic and English versions for all text fields.
    
    Content to analyze:
    ${content}
    
    Please provide a JSON response with the following structure:
    {
        "section": [
            {
                "titleAr": "Arabic section title",
                "titleEn": "English section title",
                "descriptionAr": "Arabic section description (detailed and comprehensive)",
                "descriptionEn": "English section description (detailed and comprehensive)",
                "alt": {
                    "en": "English alt text for section image",
                    "ar": "Arabic alt text for section image"
                }
            }
        ]
    }
    
    Guidelines:
    - If content is in Arabic, prioritize Arabic fields and translate to English
    - If content is in English, prioritize English fields and translate to Arabic
    - Create 3-6 sections based on the content length and complexity
    - Each section should have a clear, descriptive title
    - Each section description should be detailed (at least 100-200 words)
    - Section descriptions should be comprehensive and informative
    - Alt text should be descriptive and relevant to the section content
    - Ensure all translations are accurate and natural
    - Sections should logically divide the content into meaningful parts
    - Each section should cover a specific aspect or topic of the main content
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJsonResponse(text);

    try {
      const sectionsData = JSON.parse(jsonText);
      
      // Validate sections structure
      if (sectionsData.section && Array.isArray(sectionsData.section)) {
        sectionsData.section = sectionsData.section.map((section: any) => ({
          titleAr: section.titleAr || "",
          titleEn: section.titleEn || "",
          descriptionAr: section.descriptionAr || "",
          descriptionEn: section.descriptionEn || "",
          alt: {
            en: section.alt?.en || "",
            ar: section.alt?.ar || "",
          },
        }));
      }
      
      return NextResponse.json(sectionsData);
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

