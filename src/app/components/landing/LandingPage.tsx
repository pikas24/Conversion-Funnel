// Landing Page - Medical Elite Boutique Design
// Premium conversion funnel for clinic/aesthetic services

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Star, 
  Award, 
  Shield,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { TestimonialCarousel } from './TestimonialCarousel';

// Fade-in animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

interface LandingPageProps {
  onBookingClick: () => void;
}

export function LandingPage({ onBookingClick }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      review: 'The results exceeded my expectations. Dr. Anderson and her team made me feel comfortable throughout the entire process. My skin has never looked better!',
      rating: 5,
      treatment: 'Laser Treatment'
    },
    {
      id: 2,
      name: 'Michelle Chen',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      review: 'Professional, attentive, and truly caring. The clinic is beautiful and the staff is amazing. I highly recommend their facial brightening treatment.',
      rating: 5,
      treatment: 'Facial Brightening'
    },
    {
      id: 3,
      name: 'Amanda Rodriguez',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
      review: 'Best decision I made for my skin. The consultation was thorough and the treatment plan was tailored perfectly to my needs. Results are amazing!',
      rating: 5,
      treatment: 'Acne Treatment'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0d6e6e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-headline)' }}>
              Agency Nexus Clinic
            </span>
          </div>
          
          <Button 
            onClick={onBookingClick}
            className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white rounded-full px-6 transition-all hover:shadow-lg"
          >
            <Calendar className="size-4 mr-2" />
            Book Consultation
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeInUp}
            >
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                Elevate Your Natural Beauty
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience premium aesthetic treatments in a sanctuary of wellness. 
                Our expert physicians combine advanced techniques with personalized care 
                to help you achieve your aesthetic goals.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={onBookingClick}
                  className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white rounded-full px-8 py-6 text-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Book Your Consultation
                  <ArrowRight className="ml-2 size-5" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-[#0d6e6e] rounded-full px-8 py-6 text-lg transition-all"
                >
                  <Phone className="mr-2 size-5" />
                  Call Us
                </Button>
              </div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeIn}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=1000&fit=crop"
                  alt="Premium clinic interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#f0e6d2] rounded-full flex items-center justify-center">
                    <Award className="size-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">10+ Years</p>
                    <p className="text-sm text-gray-600">Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clinic Trust Section */}
      <section className="py-20 bg-[#fafaf9]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your health and beauty are our highest priority. We maintain the highest 
              standards in safety, hygiene, and professional care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: 'Licensed Physicians', value: 'Certified' },
              { icon: Award, label: 'Success Rate', value: '98%' },
              { icon: Star, label: 'Patient Rating', value: '4.9/5' },
              { icon: CheckCircle2, label: 'Treatments Done', value: '10,000+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
                className="text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[#0d6e6e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="size-8 text-[#0d6e6e]" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              World-Class Facility
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience comfort and luxury in our state-of-the-art clinic designed 
              for your wellbeing and peace of mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=600&fit=crop', label: 'Reception Area' },
              { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=600&fit=crop', label: 'Treatment Rooms' },
              { src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=600&fit=crop', label: 'Advanced Equipment' },
              { src: 'https://images.unsplash.com/photo-1629909615957-be38b9e90071?w=600&h=600&fit=crop', label: 'Consultation Room' }
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <ImageWithFallback
                  src={facility.src}
                  alt={facility.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <p className="text-white font-semibold text-lg">{facility.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Authority Section */}
      <section className="py-20 bg-[#fafaf9]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Doctor Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeIn}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop"
                  alt="Chief Medical Officer"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Doctor Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeInUp}
            >
              <h2 
                className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                Led by Expert Physicians
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dr. Sarah Anderson, our Chief Medical Officer, brings over 15 years of 
                experience in aesthetic medicine. Board-certified and internationally trained, 
                she leads our team with a philosophy of natural enhancement and patient safety.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Board Certified Aesthetic Physician',
                  'International Training (USA, Europe, Asia)',
                  'Published Research in Aesthetic Medicine',
                  '10,000+ Successful Treatments'
                ].map((credential, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="size-6 text-[#0d6e6e] flex-shrink-0" />
                    <p className="text-gray-700">{credential}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={onBookingClick}
                size="lg"
                className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white rounded-full px-8 transition-all hover:shadow-lg"
              >
                Schedule a Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Treatment Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Your Journey to Beauty
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach ensures personalized care at every step, 
              from consultation to post-treatment support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Consultation',
                description: 'Comprehensive skin analysis and personalized treatment plan discussion.',
                icon: Users,
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
              },
              {
                step: '02',
                title: 'Treatment',
                description: 'Expert application of advanced techniques with your comfort as priority.',
                icon: Sparkles,
                image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop'
              },
              {
                step: '03',
                title: 'Follow-up',
                description: 'Ongoing support and monitoring to ensure optimal results and satisfaction.',
                icon: Clock,
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop'
              }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={process.image}
                    alt={process.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-[#0d6e6e] rounded-full flex items-center justify-center">
                    <process.icon className="size-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-[#0d6e6e]/20 mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                    {process.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                    {process.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {process.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before-After Results Section */}
      <section className="py-20 bg-[#fafaf9]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Real Results, Real Confidence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the transformative results our patients have achieved. 
              Move the slider to compare before and after treatments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                before: 'https://images.unsplash.com/photo-1614376362393-0ea22da9e3a4?w=800&h=600&fit=crop',
                after: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
                alt: 'Facial Brightening Treatment'
              },
              {
                before: 'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&h=600&fit=crop',
                after: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop',
                alt: 'Laser Treatment Results'
              },
              {
                before: 'https://images.unsplash.com/photo-1599351432557-c1b0934e2a99?w=800&h=600&fit=crop',
                after: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop',
                alt: 'Acne Treatment Progress'
              },
              {
                before: 'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?w=800&h=600&fit=crop',
                after: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&h=600&fit=crop',
                alt: 'Skin Rejuvenation'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
              >
                <BeforeAfterSlider
                  beforeImage={item.before}
                  afterImage={item.after}
                  alt={item.alt}
                />
                <p className="text-center text-gray-600 mt-4">{item.alt}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Button
              onClick={onBookingClick}
              size="lg"
              className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white rounded-full px-8 py-6 text-lg transition-all hover:shadow-xl"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Carousel Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Hear From Our Patients
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of satisfied patients trust us with their aesthetic journey. 
              Read their stories and experiences.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeIn}
          >
            <TestimonialCarousel testimonials={testimonials} />
          </motion.div>
        </div>
      </section>

      {/* Treatment Highlight Section */}
      <section className="py-20 bg-[#fafaf9]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Popular Treatments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after aesthetic treatments, 
              each tailored to enhance your natural beauty.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Laser Treatment',
                description: 'Advanced laser technology for skin rejuvenation, pigmentation removal, and anti-aging.',
                image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
                price: 'From $299'
              },
              {
                title: 'Facial Brightening',
                description: 'Restore your skin\'s natural radiance with our signature brightening treatment.',
                image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop',
                price: 'From $199'
              },
              {
                title: 'Acne Treatment',
                description: 'Comprehensive acne solutions combining medical expertise and advanced technology.',
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop',
                price: 'From $249'
              }
            ].map((treatment, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={treatment.image}
                    alt={treatment.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                    {treatment.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {treatment.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#0d6e6e] font-bold text-lg">{treatment.price}</span>
                    <Button
                      onClick={onBookingClick}
                      variant="outline"
                      className="border-[#0d6e6e] text-[#0d6e6e] hover:bg-[#0d6e6e] hover:text-white rounded-full"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=1080&fit=crop"
            alt="Book your consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d6e6e]/95 to-[#0d6e6e]/80"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Begin Your Beauty Journey Today
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Take the first step towards the confidence you deserve. 
              Book your personalized consultation with our expert physicians.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={onBookingClick}
                className="bg-white text-[#0d6e6e] hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-semibold transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <Calendar className="mr-2 size-6" />
                Book Free Consultation
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-7 text-lg font-semibold transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <Phone className="mr-2 size-6" />
                +62 812-3456-7890
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <span>No Obligation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <span>Licensed Physicians</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <span>Same Day Availability</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0d6e6e] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-headline)' }}>
                  Agency Nexus
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Premium aesthetic clinic delivering natural beauty enhancement 
                with medical excellence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Doctors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Treatments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Before & After</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Laser Treatment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facial Brightening</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Acne Treatment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Skin Rejuvenation</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="size-5 flex-shrink-0 mt-0.5" />
                  <span>123 Beauty Street, Jakarta, Indonesia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-5 flex-shrink-0" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-5 flex-shrink-0" />
                  <span>info@agencynexus.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Agency Nexus Clinic. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}