// Configuration
exports.guidePages = [
    L('guide.introductionVideo'),
    L('guide.prepareForSurvey'),
    L('guide.gps'),
    L('guide.enterASpotter'),
    L('guide.startingASurvey'),
    L('guide.duringTheSurvey'),
    L('guide.finishTheSurvey'),
    L('guide.howToReportFeedback')
    //L('guide.windspeed'),
    //L('guide.cloudCover'),
    //L('guide.amount'),
    //L('guide.material'),
    //L('guide.category'),
    //L('guide.dimension'),
    //L('guide.distance'),
    //L('guide.sightingRemarks')
    //L('guide.surveyRemarks'),
];

exports.guideDetails = [
    [
        { heading: L('guide.introductionVideo') },
        { title: L('guide.introductionVideo') },
        { video: '/intro.mp4' }
    ],
    [
        { heading: L('guide.prepareForSurvey') },
        { title: L('guide.prepareForSurvey.introductionVideo') },
        { video: '/prepare.mp4' },
        { title: L('guide.prepareForSurvey.introduction') },
        { paragraph: L('guide.prepareForSurvey.introductionParagraph') },
        { title: L('guide.prepareForSurvey.Observer') },
        { paragraph: L('guide.prepareForSurvey.observerParagraph') }
    ],
    [
        { heading: L('guide.gps') },
        { title: L('guide.gps.introduction') },
        { paragraph: L('guide.gps.introductionParagraph') },
    ],
    [
        { heading: L('guide.enterASpotter') },
        { title: L('guide.enterASpotter.info') },
        { paragraph: L('guide.enterASpotter.infoParagraph') },
    ],
    [
        { heading: L('guide.startingASurvey') },
        { title: L('guide.prepareForSurvey.introductionVideo') },
        { video: '/start.mp4' },
        { title: L('guide.startingASurvey.introduction') },
        { paragraph: L('guide.startingASurvey.introductionParagraph') },
        { title: L('guide.startingASurvey.observer') },
        { paragraph: L('guide.startingASurvey.observerParagraph') }
    ],
    [
        { heading: L('guide.duringTheSurvey') },
        { title: L('guide.prepareForSurvey.introductionVideo') },
        { video: '/during.mp4' },
        { title: L('guide.duringTheSurvey.introduction') },
        { paragraph: L('guide.duringTheSurvey.introductionParagraph') },
    ],
    [
        { heading: L('guide.finishTheSurvey') },
        { title: L('guide.prepareForSurvey.introductionVideo') },
        { video: '/finish.mp4' },
        { title: L('guide.finishTheSurvey.introduction') },
        { paragraph: L('guide.finishTheSurvey.introductionParagraph') },
    ],
    [
        { heading: L('guide.howToReportFeedback') },
        { title: L('guide.howToReportFeedback.title') },
        { paragraph: L('guide.howToReportFeedback.paragraph') }
    ],
    // 8
    [
        { heading: L('guide.windspeed') },
        { title: L('guide.windspeed.introduction') },
        { paragraph: L('guide.windspeed.introductionParagraph') },
    ],
    [
        { heading: L('guide.cloudCover') },
        { title: L('guide.cloudCover.introduction') },
        { paragraph: L('guide.cloudCover.introductionParagraph') },
    ],
    [
        { heading: L('guide.amount') },
        { title: L('guide.amount.introduction') },
        { paragraph: L('guide.amount.introductionParagraph') },
    ],
    [
        { heading: L('guide.material') },
        { title: L('guide.material.introduction') },
        { paragraph: L('guide.material.introductionParagraph') },
    ],
    [
        { heading: L('guide.category') },
        { title: L('guide.category.introduction') },
        { paragraph: L('guide.category.introductionParagraph') },
    ],
    [
        { heading: L('guide.dimension') },
        { title: L('guide.dimension.introduction') },
        { paragraph: L('guide.dimension.introductionParagraph') },
    ],
    [
        { heading: L('guide.distance') },
        { title: L('guide.distance.introduction') },
        { paragraph: L('guide.distance.introductionParagraph') },
    ],
    [
        { heading: L('guide.sightingRemarks') },
        { title: L('guide.sightingRemarks.introduction') },
        { paragraph: L('guide.sightingRemarks.introductionParagraph') },
    ],
    [
        { heading: L('guide.surveyRemarks') },
        { title: L('guide.sightingRemarks.introduction') },
        { paragraph: L('guide.sightingRemarks.introductionParagraph') },
        { title: L('guide.surveyRemarks.introduction') },
        { paragraph: L('guide.surveyRemarks.introductionParagraph') },
    ]
];
