import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Target, Sparkles, Users, CheckCircle, TrendingUp, Zap, Award, Rocket, BarChart3 } from 'lucide-react';
import { ShaderBackground } from '@/components/ui/animated-shader-hero';
import { FeatureCarousel } from '@/components/ui/feature-carousel';
import { GradientBackground } from '@/components/ui/gradient-background';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { ImageAutoSlider } from '@/components/ui/image-auto-slider';
import { GlowCard } from '@/components/ui/spotlight-card';

const Landing = () => {
  const careerPaths = [
    {
      title: 'Engineering (JEE Path)',
      icon: '⚙️',
      description: 'Technical careers through JEE',
      gradient: 'from-blue-500 to-cyan-500',
      jobs: '500K+'
    },
    {
      title: 'Medical (NEET Path)',
      icon: '🏥',
      description: 'Healthcare through NEET',
      gradient: 'from-red-500 to-pink-500',
      jobs: '300K+'
    },
    {
      title: 'Commerce & Management',
      icon: '💼',
      description: 'Business and finance careers',
      gradient: 'from-green-500 to-emerald-500',
      jobs: '450K+'
    },
    {
      title: 'Arts & Humanities',
      icon: '🎨',
      description: 'Creative and social sciences',
      gradient: 'from-purple-500 to-violet-500',
      jobs: '200K+'
    },
    {
      title: 'Skill-based Careers',
      icon: '💻',
      description: 'Modern digital careers',
      gradient: 'from-cyan-500 to-blue-500',
      jobs: '600K+'
    },
    {
      title: 'Law & Legal',
      icon: '⚖️',
      description: 'Legal profession path',
      gradient: 'from-orange-500 to-yellow-500',
      jobs: '150K+'
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: '5 Assessment Types',
      description: 'Comprehensive personality & aptitude analysis',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Personalized Roadmaps',
      description: 'Stage-wise academic and career guidance',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Career Coach',
      description: 'Context-aware guidance powered by AI',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Progress Tracking',
      description: 'Monitor your growth and readiness',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '6+', label: 'Career Paths', icon: <Rocket className="w-5 h-5" /> },
    { value: '13+', label: 'Job Roles', icon: <TrendingUp className="w-5 h-5" /> },
    { value: '98%', label: 'Success Rate', icon: <Award className="w-5 h-5" /> },
    { value: '5', label: 'Assessments', icon: <Zap className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Animated Shader Background */}
        <div className="absolute inset-0 z-0">
          <ShaderBackground />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 backdrop-blur-md border border-orange-300/30 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-orange-100">Trusted by forward-thinking students.</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent leading-tight"
            >
              Discover Your
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent leading-tight"
            >
              Perfect Career Path
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-lg md:text-xl lg:text-2xl text-orange-100/90 font-light leading-relaxed">
              India's most comprehensive career guidance platform — Get personalized roadmaps, AI-powered insights, and real job market data to make informed decisions about your future.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 bg-orange-500/10 hover:bg-orange-500/20 border-2 border-orange-300/30 hover:border-orange-300/50 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-orange-300/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-orange-300/80 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Features Carousel */}
        <section>
          <GradientBackground
            className="min-h-[760px]"
            overlay
            overlayOpacity={0.5}
            animationDuration={10}
          >
            <div className="container mx-auto px-4 py-16 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Everything You Need to{' '}
                  <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                    Succeed
                  </span>
                </h2>
                <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                  Comprehensive tools and insights designed for Indian students
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <FeatureCarousel features={features} />
              </motion.div>
            </div>
          </GradientBackground>
        </section>

        {/* Career Paths Section with Background Paths */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950 py-20">
          {/* Background Paths Animation */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
              >
                <title>Background Paths</title>
                {Array.from({ length: 36 }, (_, i) => ({
                  id: i,
                  d: `M-${380 - i * 5} -${189 + i * 6}C-${380 - i * 5} -${189 + i * 6} -${312 - i * 5} ${216 - i * 6} ${152 - i * 5} ${343 - i * 6}C${616 - i * 5} ${470 - i * 6} ${684 - i * 5} ${875 - i * 6} ${684 - i * 5} ${875 - i * 6}`,
                  width: 0.5 + i * 0.03,
                })).map((path) => (
                  <motion.path
                    key={path.id}
                    d={path.d}
                    stroke="currentColor"
                    strokeWidth={path.width}
                    strokeOpacity={0.1 + path.id * 0.03}
                    initial={{ pathLength: 0.3, opacity: 0.6 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0.3, 0.6, 0.3],
                      pathOffset: [0, 1, 0],
                    }}
                    transition={{
                      duration: 20 + Math.random() * 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                ))}
                {Array.from({ length: 36 }, (_, i) => ({
                  id: i + 36,
                  d: `M-${380 + i * 5} -${189 + i * 6}C-${380 + i * 5} -${189 + i * 6} -${312 + i * 5} ${216 - i * 6} ${152 + i * 5} ${343 - i * 6}C${616 + i * 5} ${470 - i * 6} ${684 + i * 5} ${875 - i * 6} ${684 + i * 5} ${875 - i * 6}`,
                  width: 0.5 + i * 0.03,
                })).map((path) => (
                  <motion.path
                    key={path.id}
                    d={path.d}
                    stroke="currentColor"
                    strokeWidth={path.width}
                    strokeOpacity={0.1 + path.id * 0.03}
                    initial={{ pathLength: 0.3, opacity: 0.6 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0.3, 0.6, 0.3],
                      pathOffset: [0, 1, 0],
                    }}
                    transition={{
                      duration: 20 + Math.random() * 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                ))}
              </svg>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
                Explore{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Career Paths
                </span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover opportunities across diverse fields
              </p>
            </motion.div>

            <ImageAutoSlider>
              {careerPaths.map((path, index) => {
                const glowColors: Array<'blue' | 'purple' | 'green' | 'red' | 'orange'> = ['blue', 'purple', 'green', 'red', 'orange', 'blue'];
                return (
                  <div
                    key={index}
                    className="group cursor-pointer flex-shrink-0 w-[400px]"
                  >
                    <GlowCard 
                      glowColor={glowColors[index]}
                      customSize
                      className="!w-full !h-[280px] !p-0 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} p-8`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />

                        <div className="relative z-10">
                          <div className="text-5xl mb-4">{path.icon}</div>
                          <h3 className="text-2xl font-bold text-white mb-2">{path.title}</h3>
                          <p className="text-white/90 mb-4">{path.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {path.jobs} jobs
                            </span>
                            <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                );
              })}
            </ImageAutoSlider>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg h-14 px-8">
                    Discover Your Path
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Shape Your Future?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of students making informed career decisions with AI-powered guidance
              </p>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg h-14 px-8 shadow-2xl">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
