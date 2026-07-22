export const PRODUCT_CATEGORIES = [
  "Women's Fashion", "Men's Fashion", "Shoes", "Bags & Luggage", "Watches",
  "Jewelry & Accessories", "Beauty & Personal Care", "Hair Care & Wigs",
  "Home & Kitchen", "Home Decor", "Bedding & Bath", "Kitchen Appliances",
  "Mobile Phones", "Mobile Accessories", "Computers & Laptops", "Audio & Headphones",
  "Cameras", "Smartwatches", "Gaming", "TV & Electronics", "Automotive",
  "Tools & Hardware", "Lights & Lighting", "Garden & Outdoor", "Camping & Hiking",
  "Sports & Fitness", "Cycling", "Baby & Kids", "Toys & Games", "Pet Supplies",
  "Books & Stationery", "Arts & Crafts", "Sewing & Fabric", "Office Supplies",
  "Gifts", "Food & Beverages", "Health Care", "Islamic Products", "Party Supplies",
  "Travel Accessories",
];

export const createProductSlug = (name) => {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "product"}-${Date.now()}`;
};
