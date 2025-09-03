export const basicCategories = {
  'رياضة': {
    icon: '/images/saudi-league.png',
    color: '#4CAF50',
    subcategories: [
      {
        id: 'saudi_league',
        name: 'الدوري السعودي',
        image: '/images/saudi-league.png',
        description: 'هذه الفئة ستحتوي على أسئلة في الدوري السعودي'
      },
      {
        id: 'english_league',
        name: 'الدوري الإنجليزي',
        image: '/images/english-league.png',
        description: 'هذه الفئة ستحتوي على أسئلة في الدوري الإنجليزي الممتاز'
      },
      {
        id: 'clasico',
        name: 'الكلاسيكو',
        image: '/images/clasico.png',
        description: 'هذه الفئة ستحتوي على أسئلة في مباريات الكلاسيكو بين ريال مدريد وبرشلونة'
      },
      {
        id: 'world_cup',
        name: 'كأس العالم',
        image: '/images/world-cup.png',
        description: 'هذه الفئة ستحتوي على أسئلة في بطولة كأس العالم لكرة القدم'
      },
      {
        id: 'champions',
        name: 'دوري الأبطال',
        image: '/images/champions.png',
        description: 'هذه الفئة ستحتوي على أسئلة في دوري أبطال أوروبا لكرة القدم'
      }
    ]
  },
  'أفلام ومسلسلات': {
    icon: '🎬',
    color: '#9C27B0',
    subcategories: [
      {
        id: 'hollywood',
        name: 'هوليوود',
        image: '/images/hollywood.png',
        description: 'هذه الفئة ستحتوي على أسئلة في أفلام هوليوود والمسلسلات'
      },
      {
        id: 'TvShow',
        name: 'مسلسلات',
        image: '/images/TvShow.png',
        description: 'هذه الفئة ستحتوي على أسئلة في المسلسلات التلفزيونية'
      },
      {
        id: 'animation',
        name: 'الرسوم المتحركة',
        image: '/images/animation.png',
        description: 'هذه الفئة ستحتوي على أسئلة في الرسوم المتحركة'
      },
      {
        id: 'game_of_thrones',
        name: 'قيم اوف ثرونز',
        image: '/images/game_of_thrones.png',
        description: 'هذه الفئة ستحتوي على أسئلة في مسلسل قيم اوف ثرونز'
      },
      {
        id: 'breaking_bad',
        name: 'بريكن باد',
        image: '/images/breaking_bad.png',
        description: 'هذه الفئة ستحتوي على أسئلة في مسلسل بريكن باد'
      },
      {
        id: 'from',
        name: 'فروم',
        image: '/images/from.png',
        description: 'هذه الفئة ستحتوي على أسئلة في مسلسل فروم'
      }
    ]
  },
  'العالم': {
    icon: '👗',
    color: '#E91E63',
    subcategories: [
      {
        id: 'flags',
        name: 'اعلام دول',
        image: '/images/flags.png',
        description: 'هذه الفئة ستحتوي على أسئلة في أعلام الدول'
      },
      {
        id: 'icons',
        name: 'شعارات دول',
        image: '/images/icons.png',
        description: 'هذه الفئة ستحتوي على أسئلة في شعارات الدول'
      },
      {
        id: 'Tourist_attractions',
        name: 'معالم سياحية',
        image: '/images/Tourist_attractions.png',
        description: 'هذه الفئة ستحتوي على أسئلة في المعالم السياحية'
      },
      {
        id: 'capital',
        name: 'عاصمة',
        image: '/images/capital.png',
        description: 'هذه الفئة ستحتوي على أسئلة في عواصم الدول'
      },
      {
        id: 'map',
        name: 'الخريطة',
        image: '/images/map.png',
        description: 'هذه الفئة ستحتوي على أسئلة في الخرائط'
      }
    ]
  },
  'مطبخ': {
    icon: '🍳',
    color: '#FF9800',
    subcategories: [
      {
        id: 'arabic_cuisine',
        name: 'المطبخ العربي',
        image: '/images/arabic_cuisine.png',
        description: 'هذه الفئة ستحتوي على أسئلة في المطبخ العربي'
      },
      {
        id: 'international',
        name: 'المطبخ العالمي',
        image: '/images/international.png',
        description: 'هذه الفئة ستحتوي على أسئلة في المطبخ العالمي'
      },
      {
        id: 'desserts',
        name: 'الحلويات',
        image: '/images/desserts.png',
        description: 'هذه الفئة ستحتوي على أسئلة في الحلويات'
      },
      {
        id: 'what_is_the_food',
        name: 'وش الاكله',
        image: '/images/what_is_the_food.png',
        description: 'هذه الفئة ستحتوي على أسئلة في الأكلات'
      }
    ]
  },
  // ... باقي الفئات
};