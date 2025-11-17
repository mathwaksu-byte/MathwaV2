import { supabaseAdmin } from '../config/supabase.js';
import bcrypt from 'bcrypt';

async function setupDatabase() {
  console.log('Setting up MATHWA database...\n');

  try {
    // Create default admin user
    const password_hash = await bcrypt.hash('Admin@123', 10);
    
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('users')
      .insert([{
        email: 'admin@mathwa.com',
        password_hash,
        full_name: 'Admin User',
        role: 'admin'
      }])
      .select()
      .single();

    if (adminError) {
      console.error('Error creating admin user:', adminError.message);
    } else {
      console.log('✓ Admin user created');
      console.log('  Email: admin@mathwa.com');
      console.log('  Password: Admin@123');
      console.log('  (Please change this password after first login)\n');
    }

    // Create default site stats
    const { error: statsError } = await supabaseAdmin
      .from('site_stats')
      .insert([{
        students_sent: 500,
        years_of_partnership: 5,
        countries: 2,
        success_rate: 98
      }]);

    if (statsError && statsError.code !== '23505') { // Ignore duplicate error
      console.error('Error creating site stats:', statsError.message);
    } else {
      console.log('✓ Default site stats created\n');
    }

    // Create sample university (Kyrgyz State University)
    const { data: university, error: univError } = await supabaseAdmin
      .from('universities')
      .insert([{
        name: 'Kyrgyz State University (Arabaev University)',
        slug: 'kyrgyz-state-university',
        country: 'Kyrgyzstan',
        city: 'Bishkek',
        description: 'Kyrgyz State University (Arabaev University) is one of the leading medical universities in Kyrgyzstan, offering world-class MBBS education.',
        overview: 'Established as a premier institution for medical education, Kyrgyz State University provides comprehensive MBBS programs recognized globally. The university combines modern teaching methods with practical clinical training.',
        accreditations: ['WHO', 'NMC', 'FAIMER'],
        logo_url: '',
        hero_image_url: '',
        is_active: true,
        course_duration: '6 years',
        intake_months: ['September', 'February'],
        eligibility_criteria: 'NEET Qualified with 50% in PCB',
        hostel_info: 'Modern hostel facilities with Indian food available',
        meta_title: 'Study MBBS at Kyrgyz State University - MATHWA',
        meta_description: 'Join Kyrgyz State University for affordable MBBS education abroad. WHO & NMC approved. 100% visa support.'
      }])
      .select()
      .single();

    if (univError) {
      console.error('Error creating university:', univError.message);
    } else {
      console.log('✓ Sample university (Kyrgyz State University) created\n');

      // Create fee structure for the university
      const feeStructure = [
        { year: 1, amount: 350000, currency: 'INR', description: 'Tuition Fee Year 1' },
        { year: 2, amount: 350000, currency: 'INR', description: 'Tuition Fee Year 2' },
        { year: 3, amount: 350000, currency: 'INR', description: 'Tuition Fee Year 3' },
        { year: 4, amount: 350000, currency: 'INR', description: 'Tuition Fee Year 4' },
        { year: 5, amount: 350000, currency: 'INR', description: 'Tuition Fee Year 5' },
        { year: 6, amount: 350000, currency: 'INR', description: 'Tuition Fee Year 6' }
      ];

      const feeData = feeStructure.map(fee => ({
        university_id: university.id,
        ...fee
      }));

      const { error: feeError } = await supabaseAdmin
        .from('fee_structure')
        .insert(feeData);

      if (feeError) {
        console.error('Error creating fee structure:', feeError.message);
      } else {
        console.log('✓ Fee structure created\n');
      }
    }

    // Create sample FAQs
    const faqs = [
      {
        question: 'Is NEET required for MBBS abroad?',
        answer: 'Yes, NEET qualification is mandatory for Indian students to study MBBS abroad and practice in India.',
        category: 'Eligibility',
        display_order: 1,
        is_active: true
      },
      {
        question: 'What is the total cost of MBBS in Kyrgyzstan?',
        answer: 'The total cost including tuition, hostel, and living expenses is approximately 20-25 lakhs for the complete 6-year MBBS program.',
        category: 'Fees',
        display_order: 2,
        is_active: true
      },
      {
        question: 'Is the degree valid in India?',
        answer: 'Yes, universities we partner with are recognized by NMC (National Medical Commission), WHO, and FAIMER, making the degree valid in India.',
        category: 'Recognition',
        display_order: 3,
        is_active: true
      }
    ];

    const { error: faqError } = await supabaseAdmin
      .from('faqs')
      .insert(faqs);

    if (faqError) {
      console.error('Error creating FAQs:', faqError.message);
    } else {
      console.log('✓ Sample FAQs created\n');
    }

    console.log('Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Copy .env.example to .env and fill in your Supabase credentials');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run dev');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupDatabase();
