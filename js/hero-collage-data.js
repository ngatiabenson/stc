/**
 * STC Hero Training Showcase — Department & Scene Registry
 *
 * Three dominant panels (background / midground / foreground) rotate every 15–20s.
 * Any department may occupy any depth slot — no permanent priority.
 *
 * HOW TO ADD A DEPARTMENT:
 * 1. Add an entry under `departments` with label and images (2–8 practical-action paths).
 * 2. Add the key to `launchDepartments` or `optionalDepartments`.
 * 3. Reference the key in `scenes` (bg / mg / fg).
 *
 * IMAGES: Prefer hands-on training, tools, equipment, workshops — not group portraits.
 
window.STC_HERO_COLLAGE = {
    minImages: 2,
    maxImagesPerPanel: 8,
    sceneIntervalMinMs: 15000,
    sceneIntervalMaxMs: 20000,
    galleryRotateMinMs: 6000,
    galleryRotateMaxMs: 10000,

    launchDepartments: ['plumbing', 'electrical', 'catering', 'graduation'],
    optionalDepartments: ['ict', 'fashion'],

    departments: {
        plumbing: {
            label: 'Plumbing',
            images: [
                '/photos/plumbing.jpg',
                '/photos/plumbing.jpg',
                '/photos/plumbing4.jpg',
                '/photos/plumbing5.jpg'
                
            ]
        },
        electrical: {
            label: 'Electrical Wiring',
            images: [
                '/photos/electrical.jpg',
                '/photos/electrical2.jpg',
                '/photos/construction.jpg',
                '/photos/culturak.jpg'
            ]
        },
        ict: {
            label: 'ICT',
            placeholderTitle: 'Emerging Technology Labs',
            images: [
                '/photos/ict.jpg',
                '/photos/laundry.jpg'
            ]
        },
        fashion: {
            label: 'Fashion Design & Dressmaking',
            images: [
                '/photos/dressmaking.jpg',
                '/photos/dressmaking2.jpg',
                '/photos/tailoring.jpg'
            ]
        },
        catering: {
            label: 'Catering & Accommodation',
            images: [
                '/photos/beuty.jpeg',
                '/photos/catering.jpg',
                '/photos/catering4.jpg',
                '/photos/catering5.png'
            ]
        },
        graduation: {
            label: 'Graduation',
            images: [
                '/photos/graduation.jpg',
                '/photos/cdacc.jpg',
                '/photos/lifeatstc2.jpg'
            ]
        },
        baking: {
            label: 'Baking & Pastry',
            images: []
        },
        woodwork: {
            label: 'Woodwork',
            placeholderTitle: 'Workshop Expansion',
            images: []
        },
        metalwork: {
            label: 'Metalwork',
            placeholderTitle: 'New Training Facilities',
            images: []
        }
    },

    /**
     * Each scene assigns one department to each depth layer.
     * Departments rotate through fg / mg / bg across scenes.
    /
    scenes: [
        { bg: 'electrical', mg: 'catering', fg: 'plumbing' },
        { bg: 'catering', mg: 'plumbing', fg: 'electrical' },
        { bg: 'plumbing', mg: 'electrical', fg: 'catering' },
        { bg: 'electrical', mg: 'catering', fg: 'graduation' },
        { bg: 'graduation', mg: 'plumbing', fg: 'electrical' },
        { bg: 'plumbing', mg: 'graduation', fg: 'catering' },
        { bg: 'catering', mg: 'electrical', fg: 'graduation' },
        { bg: 'graduation', mg: 'catering', fg: 'plumbing' }
    ]
};*/
/**
 * STC Hero Training Showcase — Department & Scene Registry
 *
 * Three dominant panels (background / midground / foreground) rotate every 15–20s.
 * Any department may occupy any depth slot — no permanent priority.
 *
 * HOW TO ADD A DEPARTMENT:
 * 1. Add an entry under `departments` with label and images (2–8 practical-action paths).
 * 2. Add the key to `launchDepartments` or `optionalDepartments`.
 * 3. Reference the key in `scenes` (bg / mg / fg).
 *
 * IMAGES: Prefer hands-on training, tools, equipment, workshops — not group portraits.
 */
window.STC_HERO_COLLAGE = {
    minImages: 2,
    maxImagesPerPanel: 8,
    sceneIntervalMinMs: 15000,
    sceneIntervalMaxMs: 20000,
    galleryRotateMinMs: 6000,
    galleryRotateMaxMs: 10000,

    launchDepartments: ['plumbing', 'electrical', 'catering', 'graduation'],
    optionalDepartments: ['ict', 'fashion'],

    departments: {
        plumbing: {
            label: 'Plumbing',
            images: [
                'photos/plumbing.jpg',
                'photos/plumbing.jpg',
                'photos/plumbing4.jpg',
                'photos/plumbing5.jpg'
            ]
        },

        electrical: {
            label: 'Electrical Wiring',
            images: [
                'photos/electrical.jpg',
                'photos/electrical2.jpg',
                'photos/construction.jpg',
                'photos/culturak.jpg'
            ]
        },

        ict: {
            label: 'ICT',
            placeholderTitle: 'Emerging Technology Labs',
            images: [
                'photos/ict.jpg',
                'photos/laundry.jpg'
            ]
        },

        fashion: {
            label: 'Fashion Design & Dressmaking',
            images: [
                'photos/dressmaking.jpg',
                'photos/dressmaking2.jpg',
                'photos/tailoring.jpg'
            ]
        },

        catering: {
            label: 'Catering & Accommodation',
            images: [
                'photos/beuty.jpeg',
                'photos/catering.jpg',
                'photos/catering4.jpg',
                'photos/catering5.png'
            ]
        },

        graduation: {
            label: 'Graduation',
            images: [
                'photos/graduation.jpg',
                'photos/cdacc.jpg',
                'photos/lifeatstc2.jpg'
            ]
        },

        baking: {
            label: 'Baking & Pastry',
            images: []
        },

        woodwork: {
            label: 'Woodwork',
            placeholderTitle: 'Workshop Expansion',
            images: []
        },

        metalwork: {
            label: 'Metalwork',
            placeholderTitle: 'New Training Facilities',
            images: []
        }
    },

    /**
     * Each scene assigns one department to each depth layer.
     * Departments rotate through fg / mg / bg across scenes.
     */
    scenes: [
        { bg: 'electrical', mg: 'catering', fg: 'plumbing' },
        { bg: 'catering', mg: 'plumbing', fg: 'electrical' },
        { bg: 'plumbing', mg: 'electrical', fg: 'catering' },
        { bg: 'electrical', mg: 'catering', fg: 'graduation' },
        { bg: 'graduation', mg: 'plumbing', fg: 'electrical' },
        { bg: 'plumbing', mg: 'graduation', fg: 'catering' },
        { bg: 'catering', mg: 'electrical', fg: 'graduation' },
        { bg: 'graduation', mg: 'catering', fg: 'plumbing' }
    ]
};
