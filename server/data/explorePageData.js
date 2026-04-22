export const explorePageData = {
  sidebar: {
    title: "Refine Results",
    locationLabel: "Location",
    priceLabel: "Price",
    priceSort: {
      id: "priceSort",
      name: "priceSort",
      options: [
        { value: "", label: "Sort by price" },
        { value: "lowToHigh", label: "Low to High" },
        { value: "highToLow", label: "High to Low" }
      ]
    }
  },
  listing: {
    title: "Available Pitches",
    subtitle: "Found 24 venues in your area",
    chips: [
      { label: "All Surfaces", active: true },
      { label: "Indoor", active: false },
      { label: "Outdoor", active: false },
      { label: "Roof Top", active: false }
    ],
    venues: [
      {
        name: "The Grand Arena",
        imageSrc: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
        badge: "Top Rated",
        isFavorite: true,
        rating: "4.9",
        locationText: "Central District - 1.2km away",
        price: 85,
        selected: true,
        primaryAction: true
      },
      {
        name: "Skyline Rooftop Pitch",
        imageSrc: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=1200&auto=format&fit=crop",
        badge: "",
        isFavorite: false,
        rating: "4.7",
        locationText: "East Marina - 3.5km away",
        price: 110,
        selected: false,
        primaryAction: false
      },
      {
        name: "Northside Indoor Turf",
        imageSrc: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=1200&auto=format&fit=crop",
        badge: "",
        isFavorite: false,
        rating: "4.6",
        locationText: "North Hillview - 2.1km away",
        price: 72,
        selected: false,
        primaryAction: false
      },
      {
        name: "Marina Five Grounds",
        imageSrc: "https://plus.unsplash.com/premium_photo-1712685912274-2483dade540f?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        badge: "",
        isFavorite: true,
        rating: "4.8",
        locationText: "South Marina - 4.0km away",
        price: 98,
        selected: false,
        primaryAction: false
      }
    ]
  }
};
