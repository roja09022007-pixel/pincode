import { PostalOfficeRecord } from '../types/postal';

/**
 * DEMO POSTAL DATASET
 * 
 * IMPORTANT DISCLAIMER:
 * This is a curated sample of Indian postal office records used for prototype
 * demonstration and offline verification testing. It does not represent the full
 * official India Post database of 150,000+ PIN codes.
 * 
 * The system architecture provides an abstracted service layer (`postalService.ts`)
 * where this demo dataset can be seamlessly replaced with a real-time government or
 * postal lookup API (e.g. data.gov.in PIN directory or India Post API).
 */
export const DEMO_POSTAL_RECORDS: PostalOfficeRecord[] = [
  // --- Andhra Pradesh / Visakhapatnam ---
  {
    officeName: 'MVP Colony S.O',
    pincode: '530017',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Visakhapatnam',
    region: 'Visakhapatnam',
    circle: 'Andhra Pradesh',
    taluk: 'Visakhapatnam Urban',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    matchedLocalities: ['MVP Colony', 'Sector 1 MVP', 'Sector 6 MVP', 'Sector 9 MVP', 'ASR Nagar', 'MVP Double Road']
  },
  {
    officeName: 'Isukathota S.O',
    pincode: '530022',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Visakhapatnam',
    region: 'Visakhapatnam',
    circle: 'Andhra Pradesh',
    taluk: 'Visakhapatnam Urban',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    matchedLocalities: ['Isukathota', 'Sivajipalem', 'Pithapuram Colony']
  },
  {
    officeName: 'Lawsons Bay S.O',
    pincode: '530018',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Visakhapatnam',
    region: 'Visakhapatnam',
    circle: 'Andhra Pradesh',
    taluk: 'Visakhapatnam Urban',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    matchedLocalities: ['Lawsons Bay Colony', 'Pedda Waltair', 'Beach Road Lawson', 'Kirlampudi Layout']
  },
  {
    officeName: 'Gajuwaka S.O',
    pincode: '530026',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Visakhapatnam',
    region: 'Visakhapatnam',
    circle: 'Andhra Pradesh',
    taluk: 'Gajuwaka',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    matchedLocalities: ['Gajuwaka', 'Chaitanya Nagar', 'Old Gajuwaka', 'New Gajuwaka']
  },
  {
    officeName: 'Visakhapatnam H.O',
    pincode: '530001',
    officeType: 'H.O',
    deliveryStatus: 'Delivery',
    division: 'Visakhapatnam',
    region: 'Visakhapatnam',
    circle: 'Andhra Pradesh',
    taluk: 'Visakhapatnam Urban',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    matchedLocalities: ['One Town', 'Town Kotha Road', 'Port Area', 'Fort Ward']
  },

  // --- Karnataka / Bengaluru ---
  {
    officeName: 'Indiranagar S.O',
    pincode: '560038',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Bangalore East',
    region: 'Bengaluru HQ',
    circle: 'Karnataka',
    taluk: 'Bangalore North',
    district: 'Bengaluru',
    state: 'Karnataka',
    matchedLocalities: ['Indiranagar', '100 Feet Road', 'Defence Colony', 'HAL 2nd Stage', '12th Main Indiranagar']
  },
  {
    officeName: 'Koramangala I Block S.O',
    pincode: '560034',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Bangalore South',
    region: 'Bengaluru HQ',
    circle: 'Karnataka',
    taluk: 'Bangalore South',
    district: 'Bengaluru',
    state: 'Karnataka',
    matchedLocalities: ['Koramangala', 'Koramangala 1st Block', 'Koramangala 3rd Block', 'Koramangala 4th Block', 'Sony World Junction']
  },
  {
    officeName: 'Jayanagar S.O',
    pincode: '560011',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Bangalore South',
    region: 'Bengaluru HQ',
    circle: 'Karnataka',
    taluk: 'Bangalore South',
    district: 'Bengaluru',
    state: 'Karnataka',
    matchedLocalities: ['Jayanagar', 'Jayanagar 3rd Block', 'Jayanagar 4th Block', 'Ashoka Pillar', 'South End Circle']
  },
  {
    officeName: 'Whitefield S.O',
    pincode: '560066',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Bangalore East',
    region: 'Bengaluru HQ',
    circle: 'Karnataka',
    taluk: 'Bangalore East',
    district: 'Bengaluru',
    state: 'Karnataka',
    matchedLocalities: ['Whitefield', 'ITPL', 'Hope Farm', 'ECC Road', 'Channasandra']
  },
  {
    officeName: 'Bangalore G.P.O',
    pincode: '560001',
    officeType: 'G.P.O',
    deliveryStatus: 'Delivery',
    division: 'Bangalore GPO Division',
    region: 'Bengaluru HQ',
    circle: 'Karnataka',
    taluk: 'Bangalore North',
    district: 'Bengaluru',
    state: 'Karnataka',
    matchedLocalities: ['MG Road', 'Vidhana Soudha', 'Cubbon Park', 'Brigade Road', 'Raj Bhavan Road']
  },

  // --- Maharashtra / Mumbai & Pune ---
  {
    officeName: 'Bandra West S.O',
    pincode: '400050',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Mumbai West',
    region: 'Mumbai',
    circle: 'Maharashtra',
    taluk: 'Bandra',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    matchedLocalities: ['Bandra West', 'Hill Road', 'Linking Road', 'Pali Hill', 'Carter Road', 'Bandstand']
  },
  {
    officeName: 'Andheri East S.O',
    pincode: '400069',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Mumbai West',
    region: 'Mumbai',
    circle: 'Maharashtra',
    taluk: 'Andheri',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    matchedLocalities: ['Andheri East', 'MIDC Andheri', 'Chakala', 'JB Nagar', 'Marol']
  },
  {
    officeName: 'Mumbai G.P.O',
    pincode: '400001',
    officeType: 'G.P.O',
    deliveryStatus: 'Delivery',
    division: 'Mumbai GPO',
    region: 'Mumbai',
    circle: 'Maharashtra',
    taluk: 'Fort',
    district: 'Mumbai',
    state: 'Maharashtra',
    matchedLocalities: ['Fort', 'CST', 'Colaba', 'Ballard Estate', 'Marine Drive']
  },
  {
    officeName: 'Shivajinagar S.O',
    pincode: '411005',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Pune City West',
    region: 'Pune',
    circle: 'Maharashtra',
    taluk: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    matchedLocalities: ['Shivajinagar', 'FC Road', 'JM Road', 'Model Colony', 'Modern College Road']
  },
  {
    officeName: 'Kothrud S.O',
    pincode: '411038',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Pune City West',
    region: 'Pune',
    circle: 'Maharashtra',
    taluk: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    matchedLocalities: ['Kothrud', 'Karve Road', 'Paud Road', 'Mayur Colony', 'Vanaz Corner']
  },

  // --- Delhi / NCT ---
  {
    officeName: 'Connaught Place H.O',
    pincode: '110001',
    officeType: 'H.O',
    deliveryStatus: 'Delivery',
    division: 'New Delhi Central',
    region: 'Delhi',
    circle: 'Delhi',
    taluk: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    matchedLocalities: ['Connaught Place', 'Barakhamba Road', 'Janpath', 'Parliament Street', 'KG Marg']
  },
  {
    officeName: 'Hauz Khas S.O',
    pincode: '110016',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'New Delhi South',
    region: 'Delhi',
    circle: 'Delhi',
    taluk: 'Hauz Khas',
    district: 'South Delhi',
    state: 'Delhi',
    matchedLocalities: ['Hauz Khas', 'Hauz Khas Enclave', 'IIT Delhi', 'Green Park', 'SDA Market']
  },
  {
    officeName: 'Rohini Sector 7 S.O',
    pincode: '110085',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Delhi North',
    region: 'Delhi',
    circle: 'Delhi',
    taluk: 'Rohini',
    district: 'North West Delhi',
    state: 'Delhi',
    matchedLocalities: ['Rohini Sector 7', 'Rohini Sector 8', 'Rohini Sector 9', 'Naharpur']
  },

  // --- Telangana / Hyderabad ---
  {
    officeName: 'Madhapur S.O',
    pincode: '500081',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Hyderabad City',
    region: 'Hyderabad HQ',
    circle: 'Telangana',
    taluk: 'Serilingampally',
    district: 'Hyderabad',
    state: 'Telangana',
    matchedLocalities: ['Madhapur', 'HITEC City', 'Cyber Towers', 'Ayyappa Society', 'Kavuri Hills']
  },
  {
    officeName: 'Banjara Hills S.O',
    pincode: '500034',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Hyderabad South East',
    region: 'Hyderabad HQ',
    circle: 'Telangana',
    taluk: 'Shaikpet',
    district: 'Hyderabad',
    state: 'Telangana',
    matchedLocalities: ['Banjara Hills', 'Road No 1', 'Road No 12', 'Road No 10', 'Ministers Colony']
  },
  {
    officeName: 'Secunderabad H.O',
    pincode: '500003',
    officeType: 'H.O',
    deliveryStatus: 'Delivery',
    division: 'Secunderabad',
    region: 'Hyderabad HQ',
    circle: 'Telangana',
    taluk: 'Secunderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    matchedLocalities: ['Secunderabad Station', 'Clock Tower', 'RP Road', 'MG Road Secunderabad']
  },

  // --- Tamil Nadu / Chennai ---
  {
    officeName: 'T Nagar S.O',
    pincode: '600017',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Chennai Central',
    region: 'Chennai City',
    circle: 'Tamil Nadu',
    taluk: 'Mambalam',
    district: 'Chennai',
    state: 'Tamil Nadu',
    matchedLocalities: ['T Nagar', 'Thyagaraya Nagar', 'Pondy Bazaar', 'Panagal Park', 'Usman Road']
  },
  {
    officeName: 'Adyar S.O',
    pincode: '600020',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Chennai South',
    region: 'Chennai City',
    circle: 'Tamil Nadu',
    taluk: 'Mylapore',
    district: 'Chennai',
    state: 'Tamil Nadu',
    matchedLocalities: ['Adyar', 'Gandhi Nagar Adyar', 'Besant Avenue', 'Kasturibai Nagar']
  },
  {
    officeName: 'Raja Annamalaipuram S.O',
    pincode: '600028',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Chennai Central',
    region: 'Chennai City',
    circle: 'Tamil Nadu',
    taluk: 'Mylapore',
    district: 'Chennai',
    state: 'Tamil Nadu',
    matchedLocalities: ['RA Puram', 'Raja Annamalaipuram', 'Mandaveli', 'Greenways Road']
  },

  // --- West Bengal / Kolkata ---
  {
    officeName: 'Park Street S.O',
    pincode: '700016',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Kolkata Central',
    region: 'Kolkata',
    circle: 'West Bengal',
    taluk: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    matchedLocalities: ['Park Street', 'Camac Street', 'Free School Street', 'Ripon Street', 'Middleton Row']
  },
  {
    officeName: 'Salt Lake Sector 1 S.O',
    pincode: '700064',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Kolkata East',
    region: 'Kolkata',
    circle: 'West Bengal',
    taluk: 'Bidhannagar',
    district: 'North 24 Parganas',
    state: 'West Bengal',
    matchedLocalities: ['Salt Lake', 'Bidhannagar', 'Sector 1 Salt Lake', 'City Centre 1']
  },

  // --- Kerala / Ernakulam & Kochi ---
  {
    officeName: 'Fort Kochi S.O',
    pincode: '682001',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Aluva',
    region: 'Central Region',
    circle: 'Kerala',
    taluk: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    matchedLocalities: ['Fort Kochi', 'Princess Street', 'Vasco Da Gama Square', 'Mattancherry Road']
  },
  {
    officeName: 'Panampilly Nagar S.O',
    pincode: '682036',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Ernakulam',
    region: 'Central Region',
    circle: 'Kerala',
    taluk: 'Kanayannur',
    district: 'Ernakulam',
    state: 'Kerala',
    matchedLocalities: ['Panampilly Nagar', 'Kadavanthra', 'Giri Nagar', 'South Bridge']
  },

  // --- Rajasthan / Jaipur ---
  {
    officeName: 'Jaipur G.P.O',
    pincode: '302001',
    officeType: 'G.P.O',
    deliveryStatus: 'Delivery',
    division: 'Jaipur City',
    region: 'Jaipur',
    circle: 'Rajasthan',
    taluk: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    matchedLocalities: ['MI Road', 'Chandpole', 'Ajmeri Gate', 'Johari Bazaar', 'Tripolia']
  },
  {
    officeName: 'Malviya Nagar S.O',
    pincode: '302017',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Jaipur City',
    region: 'Jaipur',
    circle: 'Rajasthan',
    taluk: 'Sanganer',
    district: 'Jaipur',
    state: 'Rajasthan',
    matchedLocalities: ['Malviya Nagar', 'Sector 3 Malviya Nagar', 'World Trade Park', 'Gaurav Tower']
  },

  // --- Gujarat / Ahmedabad ---
  {
    officeName: 'Navrangpura S.O',
    pincode: '380009',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Ahmedabad City',
    region: 'Ahmedabad HQ',
    circle: 'Gujarat',
    taluk: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    matchedLocalities: ['Navrangpura', 'CG Road', 'Mithakhali', 'Commerce Six Roads', 'Gujarat University']
  },
  {
    officeName: 'Satellite Road S.O',
    pincode: '380015',
    officeType: 'S.O',
    deliveryStatus: 'Delivery',
    division: 'Ahmedabad City',
    region: 'Ahmedabad HQ',
    circle: 'Gujarat',
    taluk: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    matchedLocalities: ['Satellite', 'Shivranjani', 'Jodhpur Char Rasta', 'Premchand Nagar']
  }
];
