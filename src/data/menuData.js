// Complete menu data for Startup Kafé
export const menuData = {
  categories: [
    { id: 'hot-beverages', name: 'Hot Beverages', icon: 'Coffee', emoji: '☕' },
    { id: 'cold-beverages', name: 'Cold Beverages', icon: 'GlassWater', emoji: '🧊' },
    { id: 'shakes', name: 'Shakes', icon: 'Cup', emoji: '🥤' },
    { id: 'sandwiches', name: 'Sandwiches', icon: 'Sandwich', emoji: '🥪' },
    { id: 'burgers', name: 'Burgers', icon: 'Beef', emoji: '🍔' },
    { id: 'starters', name: 'Starters', icon: 'Salad', emoji: '🥗' },
    { id: 'momos', name: 'Momos', icon: 'Soup', emoji: '🥟' },
    { id: 'noodles', name: 'Noodles', icon: 'Utensils', emoji: '🍜' },
    { id: 'pasta', name: 'Pasta', icon: 'UtensilsCrossed', emoji: '🍝' },
    { id: 'chinese', name: 'Chinese', icon: 'ChefHat', emoji: '🥡' },
    { id: 'indian-snacks', name: 'Indian Snacks', icon: 'Cookie', emoji: '🍛' },
  ],
  
  items: [
    // Hot Beverages
    { id: 1, name: 'Espresso', price: 80, category: 'hot-beverages', description: 'Rich, bold espresso shot', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', isVeg: true, isPopular: true },
    { id: 2, name: 'Americano', price: 100, category: 'hot-beverages', description: 'Espresso with hot water', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', isVeg: true },
    { id: 3, name: 'Cappuccino', price: 120, category: 'hot-beverages', description: 'Espresso with steamed milk foam', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', isVeg: true, isPopular: true },
    { id: 4, name: 'Latte', price: 130, category: 'hot-beverages', description: 'Smooth espresso with steamed milk', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', isVeg: true },
    { id: 5, name: 'Mocha', price: 150, category: 'hot-beverages', description: 'Espresso with chocolate and milk', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400', isVeg: true },
    { id: 6, name: 'Hot Chocolate', price: 120, category: 'hot-beverages', description: 'Rich creamy hot chocolate', image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400', isVeg: true },
    { id: 7, name: 'Masala Chai', price: 50, category: 'hot-beverages', description: 'Traditional Indian spiced tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', isVeg: true, isPopular: true },
    { id: 8, name: 'Green Tea', price: 60, category: 'hot-beverages', description: 'Light and refreshing green tea', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400', isVeg: true },

    // Cold Beverages
    { id: 9, name: 'Iced Americano', price: 120, category: 'cold-beverages', description: 'Chilled espresso with cold water', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', isVeg: true },
    { id: 10, name: 'Iced Latte', price: 140, category: 'cold-beverages', description: 'Espresso with cold milk over ice', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', isVeg: true, isPopular: true },
    { id: 11, name: 'Cold Coffee', price: 130, category: 'cold-beverages', description: 'Blended coffee with ice cream', image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=400', isVeg: true, isPopular: true },
    { id: 12, name: 'Iced Mocha', price: 160, category: 'cold-beverages', description: 'Chocolate espresso over ice', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400', isVeg: true },
    { id: 13, name: 'Lemonade', price: 80, category: 'cold-beverages', description: 'Fresh squeezed lemonade', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', isVeg: true },
    { id: 14, name: 'Virgin Mojito', price: 100, category: 'cold-beverages', description: 'Mint, lime, and soda', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400', isVeg: true },
    { id: 15, name: 'Blue Lagoon', price: 110, category: 'cold-beverages', description: 'Blue curacao mocktail', image: 'https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400', isVeg: true },

    // Shakes
    { id: 16, name: 'Chocolate Shake', price: 150, category: 'shakes', description: 'Rich chocolate milkshake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', isVeg: true, isPopular: true },
    { id: 17, name: 'Vanilla Shake', price: 140, category: 'shakes', description: 'Classic vanilla milkshake', image: 'https://images.unsplash.com/photo-1568901839119-631418a3910d?w=400', isVeg: true },
    { id: 18, name: 'Strawberry Shake', price: 150, category: 'shakes', description: 'Fresh strawberry milkshake', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400', isVeg: true },
    { id: 19, name: 'Oreo Shake', price: 170, category: 'shakes', description: 'Oreo cookies blended shake', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', isVeg: true, isPopular: true },
    { id: 20, name: 'Mango Shake', price: 140, category: 'shakes', description: 'Fresh mango milkshake', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', isVeg: true },
    { id: 21, name: 'Banana Shake', price: 130, category: 'shakes', description: 'Creamy banana milkshake', image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=400', isVeg: true },

    // Sandwiches
    { id: 22, name: 'Veg Club Sandwich', price: 180, category: 'sandwiches', description: 'Triple-decker with fresh veggies', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', isVeg: true, isPopular: true },
    { id: 23, name: 'Grilled Cheese Sandwich', price: 150, category: 'sandwiches', description: 'Melted cheese on toasted bread', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400', isVeg: true },
    { id: 24, name: 'Paneer Tikka Sandwich', price: 200, category: 'sandwiches', description: 'Spiced paneer in grilled bread', image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400', isVeg: true, isPopular: true },
    { id: 25, name: 'Veggie Delight Sandwich', price: 160, category: 'sandwiches', description: 'Mixed vegetables with sauce', image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400', isVeg: true },
    { id: 26, name: 'Corn & Cheese Sandwich', price: 170, category: 'sandwiches', description: 'Sweet corn with melted cheese', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', isVeg: true },
    { id: 27, name: 'Mushroom Sandwich', price: 190, category: 'sandwiches', description: 'Sautéed mushrooms in herbs', image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357571d?w=400', isVeg: true },

    // Burgers
    { id: 28, name: 'Classic Veg Burger', price: 150, category: 'burgers', description: 'Crispy veg patty with fresh veggies', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', isVeg: true },
    { id: 29, name: 'Cheese Burst Burger', price: 180, category: 'burgers', description: 'Loaded with melted cheese', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isVeg: true, isPopular: true },
    { id: 30, name: 'Paneer Burger', price: 200, category: 'burgers', description: 'Grilled paneer patty', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', isVeg: true },
    { id: 31, name: 'Aloo Tikki Burger', price: 140, category: 'burgers', description: 'Spiced potato patty burger', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400', isVeg: true, isPopular: true },
    { id: 32, name: 'Mexican Burger', price: 190, category: 'burgers', description: 'Spicy Mexican style burger', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400', isVeg: true },
    { id: 33, name: 'Double Decker Burger', price: 250, category: 'burgers', description: 'Two patties, extra cheese', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', isVeg: true },

    // Starters
    { id: 34, name: 'French Fries', price: 100, category: 'starters', description: 'Crispy golden fries', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', isVeg: true, isPopular: true },
    { id: 35, name: 'Peri Peri Fries', price: 130, category: 'starters', description: 'Spicy seasoned fries', image: 'https://images.unsplash.com/photo-1630384060421-cb20aed08989?w=400', isVeg: true },
    { id: 36, name: 'Cheese Fries', price: 150, category: 'starters', description: 'Fries topped with cheese sauce', image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400', isVeg: true },
    { id: 37, name: 'Garlic Bread', price: 120, category: 'starters', description: 'Toasted bread with garlic butter', image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', isVeg: true },
    { id: 38, name: 'Cheese Garlic Bread', price: 150, category: 'starters', description: 'Garlic bread with melted cheese', image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400', isVeg: true, isPopular: true },
    { id: 39, name: 'Nachos with Salsa', price: 180, category: 'starters', description: 'Crispy nachos with dips', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', isVeg: true },
    { id: 40, name: 'Paneer Tikka', price: 220, category: 'starters', description: 'Grilled spiced paneer cubes', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', isVeg: true },
    { id: 41, name: 'Crispy Corn', price: 160, category: 'starters', description: 'Crispy fried corn kernels', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', isVeg: true },

    // Momos
    { id: 42, name: 'Steamed Veg Momos', price: 100, category: 'momos', description: '8 pcs steamed vegetable momos', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', isVeg: true, isPopular: true },
    { id: 43, name: 'Fried Veg Momos', price: 120, category: 'momos', description: '8 pcs crispy fried momos', image: 'https://images.unsplash.com/photo-1609252925148-b0f1b515e111?w=400', isVeg: true },
    { id: 44, name: 'Tandoori Momos', price: 150, category: 'momos', description: '8 pcs smoky tandoori momos', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400', isVeg: true, isPopular: true },
    { id: 45, name: 'Paneer Momos', price: 140, category: 'momos', description: '8 pcs paneer stuffed momos', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', isVeg: true },
    { id: 46, name: 'Cheese Momos', price: 160, category: 'momos', description: '8 pcs cheese filled momos', image: 'https://images.unsplash.com/photo-1609252925148-b0f1b515e111?w=400', isVeg: true },
    { id: 47, name: 'Afghani Momos', price: 170, category: 'momos', description: '8 pcs creamy Afghani momos', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400', isVeg: true },

    // Noodles
    { id: 48, name: 'Veg Hakka Noodles', price: 150, category: 'noodles', description: 'Stir-fried noodles with veggies', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isVeg: true, isPopular: true },
    { id: 49, name: 'Schezwan Noodles', price: 170, category: 'noodles', description: 'Spicy Schezwan style noodles', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', isVeg: true },
    { id: 50, name: 'Chilli Garlic Noodles', price: 170, category: 'noodles', description: 'Noodles with chilli garlic sauce', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400', isVeg: true },
    { id: 51, name: 'Singapore Noodles', price: 180, category: 'noodles', description: 'Curry flavored thin noodles', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isVeg: true },
    { id: 52, name: 'Paneer Noodles', price: 190, category: 'noodles', description: 'Noodles with paneer cubes', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', isVeg: true },

    // Pasta
    { id: 53, name: 'Penne Arrabiata', price: 180, category: 'pasta', description: 'Penne in spicy tomato sauce', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', isVeg: true },
    { id: 54, name: 'White Sauce Pasta', price: 190, category: 'pasta', description: 'Creamy white sauce pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', isVeg: true, isPopular: true },
    { id: 55, name: 'Pink Sauce Pasta', price: 200, category: 'pasta', description: 'Mix of red and white sauce', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', isVeg: true },
    { id: 56, name: 'Mac and Cheese', price: 220, category: 'pasta', description: 'Classic cheesy macaroni', image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400', isVeg: true, isPopular: true },
    { id: 57, name: 'Alfredo Pasta', price: 210, category: 'pasta', description: 'Rich Alfredo cream sauce', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', isVeg: true },

    // Chinese
    { id: 58, name: 'Veg Fried Rice', price: 150, category: 'chinese', description: 'Wok-tossed rice with veggies', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', isVeg: true, isPopular: true },
    { id: 59, name: 'Schezwan Fried Rice', price: 170, category: 'chinese', description: 'Spicy Schezwan fried rice', image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400', isVeg: true },
    { id: 60, name: 'Manchurian Rice', price: 180, category: 'chinese', description: 'Fried rice with manchurian', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', isVeg: true },
    { id: 61, name: 'Veg Manchurian Dry', price: 160, category: 'chinese', description: 'Crispy vegetable balls', image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc71?w=400', isVeg: true },
    { id: 62, name: 'Veg Manchurian Gravy', price: 180, category: 'chinese', description: 'Veg balls in brown gravy', image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc71?w=400', isVeg: true },
    { id: 63, name: 'Chilli Paneer Dry', price: 200, category: 'chinese', description: 'Spicy stir-fried paneer', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', isVeg: true, isPopular: true },
    { id: 64, name: 'Chilli Paneer Gravy', price: 220, category: 'chinese', description: 'Paneer in spicy gravy', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', isVeg: true },
    { id: 65, name: 'Spring Rolls', price: 140, category: 'chinese', description: '4 pcs crispy spring rolls', image: 'https://images.unsplash.com/photo-1606525437679-037aca74a3e9?w=400', isVeg: true },

    // Indian Snacks
    { id: 66, name: 'Samosa', price: 30, category: 'indian-snacks', description: 'Crispy potato filled pastry', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', isVeg: true, isPopular: true },
    { id: 67, name: 'Pav Bhaji', price: 120, category: 'indian-snacks', description: 'Spiced veggie mash with bread', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', isVeg: true, isPopular: true },
    { id: 68, name: 'Chole Bhature', price: 150, category: 'indian-snacks', description: 'Chickpeas with fried bread', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', isVeg: true },
    { id: 69, name: 'Aloo Paratha', price: 100, category: 'indian-snacks', description: 'Stuffed potato flatbread', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', isVeg: true },
    { id: 70, name: 'Paneer Paratha', price: 120, category: 'indian-snacks', description: 'Stuffed paneer flatbread', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', isVeg: true },
    { id: 71, name: 'Maggi', price: 80, category: 'indian-snacks', description: 'Classic 2-minute noodles', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', isVeg: true },
    { id: 72, name: 'Cheese Maggi', price: 100, category: 'indian-snacks', description: 'Maggi with extra cheese', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', isVeg: true },
    { id: 73, name: 'Bread Pakora', price: 60, category: 'indian-snacks', description: 'Stuffed fried bread fritters', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', isVeg: true },
  ]
};

export const getItemsByCategory = (categoryId) => {
  return menuData.items.filter(item => item.category === categoryId);
};

export const getPopularItems = () => {
  return menuData.items.filter(item => item.isPopular);
};

export const searchItems = (query) => {
  const lowerQuery = query.toLowerCase();
  return menuData.items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
};

export const getCategoryById = (categoryId) => {
  return menuData.categories.find(cat => cat.id === categoryId);
};
