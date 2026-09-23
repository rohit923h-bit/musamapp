export interface City {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
}

export const indianCities: City[] = [
  { name: 'New Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
  { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
  { name: 'Chandigarh', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794 },
  { name: 'Dehradun', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', latitude: 34.0837, longitude: 74.7973 },
  { name: 'Shimla', state: 'Himachal Pradesh', latitude: 31.1048, longitude: 77.1734 },
  { name: 'Goa (Panaji)', state: 'Goa', latitude: 15.4989, longitude: 73.8278 },
  { name: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.5241, longitude: 76.9366 },
  { name: 'Kochi', state: 'Kerala', latitude: 9.9312, longitude: 76.2673 },
  { name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577 },
  { name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 },
  { name: 'Patna', state: 'Bihar', latitude: 25.6093, longitude: 85.1376 },
  { name: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362 },
  { name: 'Ranchi', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096 },
  { name: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185 },
  { name: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558 },
  { name: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882 },
  { name: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311 },
  { name: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739 },
  { name: 'Agra', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081 },
  { name: 'Mysore', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394 },
  { name: 'Amritsar', state: 'Punjab', latitude: 31.6340, longitude: 74.8723 },
  { name: 'Jodhpur', state: 'Rajasthan', latitude: 26.2389, longitude: 73.0243 },
  { name: 'Raipur', state: 'Chhattisgarh', latitude: 21.2514, longitude: 81.6296 },
  { name: 'Mangalore', state: 'Karnataka', latitude: 12.9141, longitude: 74.8560 },
  { name: 'Dehradun', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322 },
  { name: 'Gangtok', state: 'Sikkim', latitude: 27.3314, longitude: 88.6138 },
  { name: 'Imphal', state: 'Manipur', latitude: 24.8170, longitude: 93.9368 },
  { name: 'Shillong', state: 'Meghalaya', latitude: 25.5788, longitude: 91.8933 },
  { name: 'Aizawl', state: 'Mizoram', latitude: 23.1645, longitude: 92.9376 },
  { name: 'Dispur', state: 'Assam', latitude: 26.1445, longitude: 91.7362 },
];

export function searchCities(query: string): City[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return indianCities.filter(
    city => city.name.toLowerCase().includes(q) || city.state.toLowerCase().includes(q)
  ).slice(0, 8);
}
