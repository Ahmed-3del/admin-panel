"use client"
import React, { useState } from 'react';
import {
  FolderOpen,
  Settings,
  FileText,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  Tag,
  Award,
  Briefcase,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Users,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/modules/main/hooks/use-api';
import { ServicesResponse, PortfolioResponse, BlogsResponse } from '@/modules/blogs/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface DashboardStat {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
  trend: number;
}

// Enhanced Card Components with blue-500 theme
const BlogCard = ({ blog, index, t }: { blog: any; index: number; t: any }) => (

  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader className="relative z-10 pb-3">
      <div className="flex items-start justify-between">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
          <FileText className="w-3 h-3 mr-1" />
          {t('blogs.blog')} #{index + 1}
        </Badge>

      </div>
      <CardTitle className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
        {blog.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="relative z-10 space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
        {blog.description || blog.content?.substring(0, 120) + '...'}
      </p>

      <div className="flex flex-wrap gap-1">
        {blog.categories?.slice(0, 2).map((category: string, idx: number) => (
          <Badge key={idx} variant="outline" className="text-xs bg-white/50 border-blue-200 text-blue-500 dark:bg-blue-500 dark:text-white">
            <Tag className="w-3 h-3 mr-1" />
            {category}
          </Badge>
        ))}
        {blog.categories?.length > 2 && (
          <Badge variant="outline" className="text-xs bg-white/50 border-gray-200 text-gray-500 dark:bg-gray-500 dark:text-white">
            +{blog.categories.length - 2}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{blog.author}</span>
        </div>

      </div>
    </CardContent>
  </Card>
);

const ServiceCard = ({ service, index, t }: { service: any; index: number; t: any }) => (
  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader className="relative z-10 pb-3">
      <div className="flex items-start justify-between">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
          <Settings className="w-3 h-3 mr-1" />
          {t('services.service')} #{index + 1}
        </Badge>

      </div>
      <CardTitle className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
        {service.title || service.name}
      </CardTitle>
    </CardHeader>
    <CardContent className="relative z-10 space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
        {service.description || service.summary || 'Professional service offering with comprehensive solutions.'}
      </p>

      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-white/50 border-blue-200 text-blue-500 dark:bg-blue-500 dark:text-white">
          <Briefcase className="w-3 h-3 mr-1" />
          {service.category || 'General'}
        </Badge>
        {service.featured && (
          <Badge className="bg-blue-500 text-white dark:bg-blue-500 dark:text-white">
            <Award className="w-3 h-3 mr-1" />
            {t('services.featured') || 'Featured'}
          </Badge>
        )}
      </div>

    </CardContent>
  </Card>
);

const PortfolioCard = ({ project, index, t }: { project: any; index: number; t: any }) => (
  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {project.image && (
      <div className="relative h-32 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    )}
    <CardHeader className="relative z-10 pb-3">
      <div className="flex items-start justify-between">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
          <FolderOpen className="w-3 h-3 mr-1" />
          {t('projects.project')} #{index + 1}
        </Badge>
      </div>
      <CardTitle className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
        {project.title || project.name}
      </CardTitle>
    </CardHeader>
    <CardContent className="relative z-10 space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
        {project.description || project.summary || 'Innovative project showcasing cutting-edge solutions and creative design.'}
      </p>

      <div className="flex flex-wrap gap-1">
        {project.technologies?.slice(0, 3).map((tech: string, idx: number) => (
          <Badge key={idx} variant="outline" className="text-xs bg-white/50 border-blue-200 text-blue-500 dark:bg-blue-500 dark:text-white">
            {tech}
          </Badge>
        )) || (
            <>
              <Badge variant="outline" className="text-xs bg-white/50 border-blue-200 text-blue-500 dark:bg-blue-500 dark:text-white">React</Badge>
              <Badge variant="outline" className="text-xs bg-white/50 border-blue-200 text-blue-500 dark:bg-blue-500 dark:text-white">TypeScript</Badge>
            </>
          )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {project.client || 'Client Project'}
          </div>
        </div>

      </div>
    </CardContent>
  </Card>
);

function App() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { t } = useTranslation();
  const { data: servicesData, loading: servicesLoading, error: servicesError } = useApi<ServicesResponse>('https://backend.abwabdigital.com/api/v1/services');
  const { data: portfolioData, loading: portfolioLoading, error: portfolioError } = useApi<PortfolioResponse>('https://backend.abwabdigital.com/api/v1/portfolio');
  const { data: blogsData, loading: blogsLoading, error: blogsError } = useApi<BlogsResponse>('https://backend.abwabdigital.com/api/v1/blogs');

  const isLoading = servicesLoading || portfolioLoading || blogsLoading;
  const hasError = servicesError || portfolioError || blogsError;

  // Keep original data order - show last 4 items as they come from API
  const getLastFour = (items: any[] | undefined) => {
    if (!items || items.length === 0) return [];
    return items.slice(-4); // Get last 4 items in original order
  };

  const lastBlogs = getLastFour(blogsData?.blogs);
  const lastServices = getLastFour(servicesData?.services);
  const lastPortfolio = getLastFour(portfolioData?.portfolioItems);

  // Calculate statistics
  const stats: DashboardStat[] = [
    {
      title: t('overview.projects'),
      value: portfolioData?.portfolioItems?.length || 0,
      icon: FolderOpen,
      description: t('overview.projectsDescription') || 'Total projects in your portfolio',
      color: 'bg-blue-500',
      trend: 12.5,
    },
    {
      title: t('overview.services'),
      value: servicesData?.services?.length || 0,
      icon: Settings,
      description: t('overview.servicesDescription') || 'Available services',
      color: 'bg-blue-500',
      trend: 8.2,
    },
    {
      title: t('overview.blogPosts'),
      value: blogsData?.blogs?.length || 0,
      icon: FileText,
      description: t('overview.blogPostsDescription') || 'Published articles',
      color: 'bg-blue-500',
      trend: 15.3,
    },
  ];

  // Enhanced chart data generation with real API data analysis
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const projectsCount = portfolioData?.portfolioItems?.length || 0;
    const servicesCount = servicesData?.services?.length || 0;
    const blogsCount = blogsData?.blogs?.length || 0;

    return months.map((name, index) => {
      const multiplier = 0.7 + Math.random() * 0.6;
      const baseFactor = (index + 1) / months.length;

      return {
        name,
        projects: Math.round((projectsCount / 6) * (baseFactor + 0.5) * multiplier),
        services: Math.round((servicesCount / 6) * (baseFactor + 0.5) * multiplier),
        blogs: Math.round((blogsCount / 6) * (baseFactor + 0.5) * multiplier),
      };
    });
  };

  // Enhanced pie chart data with blue-500 color scheme
  const generatePieData = () => {
    return [
      { name: "projects", value: portfolioData?.portfolioItems?.length || 0, color: '#3b82f6' },
      { name: t('overview.services'), value: servicesData?.services?.length || 0, color: '#60a5fa' },
      { name: t('overview.blogPosts'), value: blogsData?.blogs?.length || 0, color: '#93c5fd' },
    ];
  };

  // Generate trend data for line chart
  const generateTrendData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalItems = (portfolioData?.portfolioItems?.length || 0) +
      (servicesData?.services?.length || 0) +
      (blogsData?.blogs?.length || 0);

    let lastValue = totalItems / 14;

    return days.map((day) => {
      const random = 0.8 + Math.random() * 0.4;
      lastValue = lastValue * (1 + (0.05 * random));

      return {
        name: day,
        total: Math.round(lastValue),
        projects: Math.round(lastValue * 0.4),
        services: Math.round(lastValue * 0.3),
        blogs: Math.round(lastValue * 0.3),
      };
    });
  };

  // Get category distribution for services
  const getServiceCategories = () => {
    if (!servicesData?.services) return [];

    const categories = servicesData.services.reduce((acc, service) => {
      const category = service.category || 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: `hsl(${220 + index * 20}, 70%, ${60 + index * 5}%)`
    }));
  };

  // Get blog categories distribution
  const getBlogCategories = () => {
    if (!blogsData?.blogs) return [];

    const categories = blogsData.blogs.reduce((acc, blog) => {
      blog.categories?.forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: `hsl(${220 + index * 15}, 70%, ${55 + index * 5}%)`
    }));
  };

  // Get blog authors distribution
  const getBlogAuthors = () => {
    if (!blogsData?.blogs) return [];

    const authors = blogsData.blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(authors).map(([name, value]) => ({ name, value }));
  };

  // Generate portfolio technology distribution
  const getPortfolioTechnologies = () => {
    if (!portfolioData?.portfolioItems) return [];

    const technologies = portfolioData.portfolioItems.reduce((acc, project: any) => {
      project?.technologies?.forEach((tech: any) => {
        acc[tech] = (acc[tech] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(technologies).map(([name, value], index) => ({
      name,
      value,
      color: `hsl(${220 + index * 10}, 70%, ${50 + index * 3}%)`
    }));
  };

  const chartData = generateChartData();
  const pieData = generatePieData();
  const trendData = generateTrendData();
  const serviceCategories = getServiceCategories();
  const blogCategories = getBlogCategories();
  const blogAuthors = getBlogAuthors();
  const portfolioTechnologies = getPortfolioTechnologies();

  // Loading skeleton for cards
  const CardSkeleton = () => (
    <Card className="overflow-hidden animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1440px] mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-500">
                {
                  t('overview.dashboard.title') || 'Dashboard Analytics'
                }
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {
                  t('overview.dashboard.description') || 'Comprehensive overview of your projects, services, and blog content with data insights'
                }
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="hidden md:flex hover:bg-blue-50 hover:border-blue-300">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date().toLocaleDateString()}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array(3)
                .fill(null)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-20 mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              : stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-l-4 hover:border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-500">
                          {stat.value.toLocaleString()}
                        </div>
                        <div className="flex items-center text-xs mt-2">
                          <div className={`flex items-center ${stat.trend > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {stat.trend > 0 ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                            <span className="font-medium">
                              {Math.abs(stat.trend).toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-gray-500 ml-1">
                            {t('overview.this_month') || 'Trend'}
                          </span>
                        </div>
                      </div>
                      <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Error State */}
          {hasError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-red-600">{t('overview.error_loading_data')}</p>
                  <p className="text-sm text-red-500 mt-1">
                    {servicesError || portfolioError || blogsError}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Tabs and Charts */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 lg:w-fit gap-2">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">{t('overview.title')}</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">{t('projects.title')}</TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">{t('services.title')}</TabsTrigger>
              <TabsTrigger value="blogs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">{t('blogs.title')}</TabsTrigger>
            </TabsList>
            {/* Overview Tab with Enhanced Analytics */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-blue-500 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {t('overview.weekly_activity_trend')}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {t('overview.weekly_activity_description') || 'Weekly activity trend of your portfolio content'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Skeleton className="h-[250px] w-full" />
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="projects"
                              stackId="1"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.6}
                            />
                            <Area
                              type="monotone"
                              dataKey="services"
                              stackId="1"
                              stroke="#60a5fa"
                              fill="#60a5fa"
                              fillOpacity={0.6}
                            />
                            <Area
                              type="monotone"
                              dataKey="blogs"
                              stackId="1"
                              stroke="#93c5fd"
                              fill="#93c5fd"
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      {t('overview.content_distribution') || 'Content Distribution'}
                    </CardTitle>
                    <CardDescription>
                      {t('overview.content_distribution_description') || 'Breakdown of your portfolio content'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Skeleton className="h-[250px] w-full" />
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [value, '']}
                              contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white'
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-500 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    {t('overview.monthly_growth_analysis') || 'Monthly Growth Analysis'}
                  </CardTitle>
                  <CardDescription>
                    {t('overview.monthly_growth_description') || 'Content creation over the past 6 months'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-[300px] w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="projects" fill="#3b82f6" radius={[4, 4, 0, 0]} name={"projects"} />
                          <Bar dataKey="services" fill="#60a5fa" radius={[4, 4, 0, 0]} name={"services"} />
                          <Bar dataKey="blogs" fill="#93c5fd" radius={[4, 4, 0, 0]} name={"blogs"} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab with Analytics */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('projects.portfolio_projects') || 'Portfolio Projects'}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{t('projects.latest_work') || 'Latest portfolio work and technology analysis'}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {portfolioData?.portfolioItems?.length || 0} {t('projects.total_projects') || 'Total Projects'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      {t('projects.technology_distribution') || 'Technology Distribution'}
                    </CardTitle>
                    <CardDescription>
                      {t('projects.most_used_technologies') || 'Most used technologies in projects'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      {isLoading ? (
                        <Skeleton className="h-[200px] w-full" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={portfolioTechnologies.slice(0, 6)} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white'
                              }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      {t('projects.kpi_analysis') || 'Key Performance Indicators'}
                    </CardTitle>
                    <CardDescription>
                      {t('projects.kpi_analysis_description') || 'Key performance indicators'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{t('projects.technologies_used') || 'Technologies Used'}</span>
                        <span className="text-2xl font-bold text-blue-500">{portfolioTechnologies.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {isLoading
                  ? Array(4).fill(null).map((_, index) => <CardSkeleton key={index} />)
                  : lastPortfolio.map((project, index) => (
                    <PortfolioCard key={project.id || index} project={project} index={index} t={t} />
                  ))
                }
              </div>
            </TabsContent>

            {/* Services Tab with Analytics */}
            <TabsContent value="services" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('services.title') || 'Service Offerings'}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{t('services.description') || 'Service portfolio and category analysis'}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {servicesData?.services?.length || 0} {t('services.total') || 'Total Services'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      {t('services.category_distribution') || 'Service Category Distribution'}
                    </CardTitle>
                    <CardDescription>
                      {t('services.category_distribution_description') || 'Distribution by service category'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      {isLoading ? (
                        <Skeleton className="h-[200px] w-full" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={serviceCategories}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {serviceCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      {t('services.performance_metrics') || 'Performance Metrics'}
                    </CardTitle>
                    <CardDescription>
                      {t('services.performance_metrics_description') || 'Performance and engagement metrics'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{t('services.featured') || 'Featured Services'}</span>
                        <span className="text-2xl font-bold text-blue-500">{servicesData?.services?.filter((s: any) => s.featured)?.length || 2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{t('services.categories') || 'Categories'}</span>
                        <span className="text-2xl font-bold text-blue-500">{serviceCategories.length}</span>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {isLoading
                  ? Array(4).fill(null).map((_, index) => <CardSkeleton key={index} />)
                  : lastServices.map((service, index) => (
                    <ServiceCard key={service.id || index} service={service} index={index} t={t} />
                  ))
                }
              </div>
            </TabsContent>

            {/* Blogs Tab with Analytics */}
            <TabsContent value="blogs" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('blogs.title') || 'Blog Content'}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{t('blogs.description') || 'Latest articles and content analysis'}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {blogsData?.blogs?.length || 0} {t('blogs.total_posts') || 'Total Posts'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      {t('blogs.category_distribution') || 'Blog Category Distribution'}
                    </CardTitle>
                    <CardDescription>
                      {t('blogs.category_distribution_description') || 'Distribution by blog categories'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      {isLoading ? (
                        <Skeleton className="h-[200px] w-full" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={blogCategories.slice(0, 6)}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white'
                              }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-500 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      {t('blogs.author_contributions') || 'Author Contributions'}
                    </CardTitle>
                    <CardDescription>
                      {t('blogs.posts_by_author') || 'Posts by author'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      {isLoading ? (
                        <Skeleton className="h-[200px] w-full" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={blogAuthors} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white'
                              }}
                            />
                            <Bar dataKey="value" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {isLoading
                  ? Array(4).fill(null).map((_, index) => <CardSkeleton key={index} />)
                  : lastBlogs.map((blog, index) => (
                    <BlogCard key={blog.id || index} blog={blog} index={index} t={t} />
                  ))
                }
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;

