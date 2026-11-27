import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Survey {
  id: number;
  category: string;
  title: string;
  daysLeft: number;
  status: 'active' | 'past';
  endDate?: string;
  description?: string;
  questions?: ResultQuestion[];
  completed?: boolean;
}

interface SurveyAnswer {
  id: number;
  text: string;
}

interface SurveyQuestion {
  id: number;
  text: string;
  multipleAnswers: boolean;
  answers: SurveyAnswer[];
}

interface ResultAnswer {
  text: string;
  votes: number;
  selected: boolean;
}

interface ResultQuestion {
  id: number;
  text: string;
  multipleAnswers: boolean;
  answers: ResultAnswer[];
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  currentPage: 'home' | 'create-survey' | 'single-survey' = 'home';

  activeTab: 'active' | 'past' = 'active';

  categoriesOpen = false;

  selectedCategory = 'All Surveys';

  categories = [
    'All Surveys',
    'Team activities',
    'Gaming',
    'Healthy Lifestyle',
  ];

  // CREATE SURVEY

  surveyName = '';
  surveyEndDate = '';
  surveyCategory = '';
  surveyDescription = '';

  publishToastVisible = false;
  validationToastVisible = false;

  // CATEGORY DROPDOWN

  surveyCategoryOpen = false;

  surveyCategoryOptions = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation',
  ];

  private readonly storageKey = 'poll-app-surveys-v1';
  private nextSurveyId = 7;
  private currentSurvey?: Survey;
  private nextQuestionId = 1;
  private nextAnswerId = 1;

  questions: SurveyQuestion[] = [
    this.createQuestion(),
  ];

  // SINGLE SURVEY INFORMATION

  singleSurveyTitle = "Let's Plan the Next Team Event Together";

  singleSurveyCategory = 'Team activities';

  singleSurveyEndDate = ''; 

  singleSurveyDescription =
    'We want to create team activities that everyone will enjoy – ' +
    'share your preferences and ideas in our survey to help us ' +
    'plan better experiences together.';

  surveyCompleted = false;

  // SINGLE SURVEY QUESTIONS
  // INITIAL SURVEY DATA

  private demoQuestions: ResultQuestion[] = [
    {
      id: 1,
      text: 'Which date would work best for you?',
      multipleAnswers: true,
      answers: [
        {
          text: '19.09.2025, Friday',
          votes: 0,
          selected: false,
        },
        {
          text: '10.10.2025, Friday',
          votes: 0,
          selected: false,
        },
        {
          text: '11.10.2025, Saturday',
          votes: 0,
          selected: false,
        },
        {
          text: '31.10.2025, Friday',
          votes: 0,
          selected: false,
        },
      ],
    },
    {
      id: 2,
      text: 'Choose the activities you prefer',
      multipleAnswers: true,
      answers: [
        {
          text: 'Outdoor adventure like kayaking',
          votes: 0,
          selected: false,
        },
        {
          text: 'Office Costume Party',
          votes: 0,
          selected: false,
        },
        {
          text: 'Bowling, mini-golf, volleyball',
          votes: 0,
          selected: false,
        },
        {
          text: 'Beach party, Music & cocktails',
          votes: 0,
          selected: false,
        },
        {
          text: 'Escape room',
          votes: 0,
          selected: false,
        },
      ],
    },
    {
      id: 3,
      text: "What's most important to you in a team event?",
      multipleAnswers: false,
      answers: [
        {
          text: 'Team bonding',
          votes: 0,
          selected: false,
        },
        {
          text: 'Food and drinks',
          votes: 0,
          selected: false,
        },
        {
          text: 'Trying something new',
          votes: 0,
          selected: false,
        },
        {
          text: 'Keeping it low-key and stress-free',
          votes: 0,
          selected: false,
        },
      ],
    },
    {
      id: 4,
      text: 'How long would you prefer the event to last?',
      multipleAnswers: false,
      answers: [
        {
          text: 'Half a day',
          votes: 0,
          selected: false,
        },
        {
          text: 'Full day',
          votes: 0,
          selected: false,
        },
        {
          text: 'Evening only',
          votes: 0,
          selected: false,
        },
      ],
    },
  ];

  resultQuestions: ResultQuestion[] = [];

  // EXISTING SURVEYS

  surveys: Survey[] = [
    {
      id: 1,
      category: 'Team activities',
      title: "Let's Plan the Next Team Event Together",
      daysLeft: 1,
      status: 'active',
    },
    {
      id: 2,
      category: 'Gaming',
      title: 'Gaming habits and favorite games!',
      daysLeft: 3,
      status: 'active',
    },
    {
      id: 3,
      category: 'Healthy Lifestyle',
      title: 'Healthier future: Fit & wellness survey!',
      daysLeft: 2,
      status: 'active',
    },
    {
      id: 4,
      category: 'Gaming',
      title: 'Gaming habits and favorite games!',
      daysLeft: 3,
      status: 'active',
    },
    {
      id: 5,
      category: 'Healthy Lifestyle',
      title: 'Healthier future: Fit & wellness survey!',
      daysLeft: 2,
      status: 'active',
    },
    {
      id: 6,
      category: 'Team activities',
      title: "Let's Plan the Next Team Event Together",
      daysLeft: 1,
      status: 'active',
    },
  ];

  // LOCAL STORAGE

  constructor() {
    this.loadStoredSurveys();
  }

  private loadStoredSurveys(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      const surveys: Survey[] = JSON.parse(stored);
      if (!Array.isArray(surveys) || surveys.length < 6) return;
      this.surveys = surveys;
      this.restoreSurveyMetadata();
    } catch (error) {
      console.warn('Could not load saved surveys.', error);
    }
  }

  private restoreSurveyMetadata(): void {
    this.nextSurveyId = Math.max(6, ...this.surveys.map((survey) => survey.id)) + 1;
    this.surveys.forEach((survey) => {
      if (!this.categories.includes(survey.category)) {
        this.categories.push(survey.category);
      }
    });
  }

  private saveSurveys(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.surveys));
    } catch (error) {
      console.warn('Could not save surveys.', error);
    }
  }

  // HIGHLIGHT CAROUSEL DRAG

  carouselDragging = false;
  private carouselPointerId: number | null = null;
  private carouselStartX = 0;
  private carouselStartScroll = 0;
  private carouselMoved = false;

  startCarouselDrag(event: PointerEvent): void {
    const carousel = event.currentTarget as HTMLElement;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    this.carouselMoved = false;
    if (carousel.scrollWidth <= carousel.clientWidth) return;
    this.carouselPointerId = event.pointerId;
    this.carouselStartX = event.clientX;
    this.carouselStartScroll = carousel.scrollLeft;
  }

  moveCarouselDrag(event: PointerEvent): void {
    if (this.carouselPointerId !== event.pointerId) return;
    const carousel = event.currentTarget as HTMLElement;
    const distance = event.clientX - this.carouselStartX;
    if (!this.carouselMoved && Math.abs(distance) < 6) return;
    this.carouselMoved = true;
    this.carouselDragging = true;
    carousel.classList.add('is-dragging');
    carousel.setPointerCapture(event.pointerId);
    carousel.scrollLeft = this.carouselStartScroll - distance;
    event.preventDefault();
  }

  endCarouselDrag(event: PointerEvent): void {
    if (this.carouselPointerId !== event.pointerId) return;
    const carousel = event.currentTarget as HTMLElement;
    this.carouselPointerId = null;
    this.carouselDragging = false;
    carousel.classList.remove('is-dragging');
    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }
  }

  leaveCarouselDrag(event: PointerEvent): void {
    if (!this.carouselDragging) this.endCarouselDrag(event);
  }

  openHighlightSurvey(event: MouseEvent, id: number): void {
    if (this.carouselMoved && event.detail !== 0) {
      this.carouselMoved = false;
      return;
    }
    this.openSurvey(id);
  }

  // HOME PAGE

  get highlightSurveys(): Survey[] {
    return [
      this.surveys[0],
      {
        ...this.surveys[2],
        category: 'Health & Wellness',
        title: 'Fit & wellness survey!',
      },
      {
        ...this.surveys[1],
        category: 'Gaming & Entertainment',
      },
    ];
  }

  get filteredSurveys(): Survey[] {
    return this.surveys.filter((survey) => {
      const matchesTab = survey.status === this.activeTab;

      const matchesCategory =
        this.selectedCategory === 'All Surveys' ||
        survey.category === this.selectedCategory;

      return matchesTab && matchesCategory;
    });
  }

  setTab(tab: 'active' | 'past'): void {
    this.activeTab = tab;
  }

  toggleCategories(): void {
    this.categoriesOpen = !this.categoriesOpen;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categoriesOpen = false;
  }

  // PAGE NAVIGATION

  /**
   * Opens the Create Survey page.
   */
  createSurvey(): void {
    this.currentPage = 'create-survey';
  }

  /**
   * Returns to the home page.
   */
  goHome(): void {
    this.closeValidationToast();
    this.currentPage = 'home';
  }

  /**
   * Opens a published survey or a demo survey.
   */
  openSurvey(id: number): void {
    const survey = this.surveys.find((item) => item.id === id);
    if (!survey) return;
    if (!survey.questions && (id >= 1 && id <= 6)) {
      this.prepareDemoSurvey(survey);
    }
    if (!survey.questions) return;
    this.currentSurvey = survey;
    this.loadSurvey(survey);
    this.currentPage = 'single-survey';
  }

  private prepareDemoSurvey(survey: Survey): void {
    if (survey.id === 2 || survey.id === 4) {
      survey.description = 'Share your gaming preferences and help us discover what players enjoy most.';
      survey.questions = this.createGamingQuestions();
      return;
    }
    if (survey.id === 3 || survey.id === 5) {
      survey.description = 'Share your everyday habits and preferences for a healthier lifestyle.';
      survey.questions = this.createWellnessQuestions();
      return;
    }
    this.prepareTeamSurvey(survey);
  }

  private createGamingQuestions(): ResultQuestion[] {
    return [
      this.createDemoQuestion(1, 'What is your favorite gaming platform?', false,
        ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']),
      this.createDemoQuestion(2, 'Which game genres do you prefer?', true,
        ['Action', 'Sports', 'Role-playing', 'Strategy', 'Adventure']),
      this.createDemoQuestion(3, 'How often do you play video games?', false,
        ['Daily', 'Several times a week', 'Once a week', 'Rarely', 'Never']),
      this.createDemoQuestion(4, 'Which game mode do you prefer?', false,
        ['Single-player', 'Multiplayer', 'Both']),
    ];
  }

  private createWellnessQuestions(): ResultQuestion[] {
    return [
      this.createDemoQuestion(1, 'How often do you exercise?', false,
        ['Daily', 'Several times a week', 'Once a week', 'Rarely', 'Never']),
      this.createDemoQuestion(2, 'Which activities do you enjoy?', true,
        ['Walking', 'Running', 'Strength training', 'Yoga', 'Cycling']),
      this.createDemoQuestion(3, 'Which wellness goals matter most to you?', true,
        ['Balanced nutrition', 'Better sleep', 'More exercise', 'Less stress']),
      this.createDemoQuestion(4, 'How much time do you spend on relaxation daily?', false,
        ['Less than 15 minutes', '15–30 minutes', '30–60 minutes', 'More than an hour']),
    ];
  }

  private createDemoQuestion(
    id: number, text: string, multipleAnswers: boolean, options: string[],
  ): ResultQuestion {
    return {
      id,
      text,
      multipleAnswers,
      answers: options.map((text) => ({ text, votes: 0, selected: false })),
    };
  }

  private prepareTeamSurvey(survey: Survey): void {
    survey.description = 'We want to create team activities that everyone will enjoy – ' +
      'share your preferences and ideas in our survey to help us ' +
      'plan better experiences together.';
    survey.questions = this.demoQuestions.map((question) => ({
      ...question,
      answers: question.answers.map((answer) => ({ ...answer })),
    }));
  }

  private loadSurvey(survey: Survey): void {
    this.singleSurveyTitle = survey.title;
    this.singleSurveyCategory = survey.category;
    this.singleSurveyEndDate = survey.endDate ?? '';
    this.singleSurveyDescription = survey.description ?? '';
    this.resultQuestions = survey.questions ?? [];
    this.surveyCompleted = survey.completed ?? false;
  }

  // QUESTION FUNCTIONS

  /**
   * Creates an empty question with two answers.
   */
  private createQuestion(): SurveyQuestion {
    return {
      id: this.nextQuestionId++,
      text: '',
      multipleAnswers: false,
      answers: [
        this.createAnswer(),
        this.createAnswer(),
      ],
    };
  }

  /**
   * Adds a new question to the survey.
   */
  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  /**
   * Removes a question while keeping at least one.
   */
  removeQuestion(questionId: number): void {
    if (this.questions.length <= 1) {
      return;
    }

    this.questions = this.questions.filter(
      (question) => question.id !== questionId,
    );
  }

  // ANSWER FUNCTIONS

  /**
   * Creates an empty answer.
   */
  private createAnswer(): SurveyAnswer {
    return {
      id: this.nextAnswerId++,
      text: '',
    };
  }

  /**
   * Adds an answer while keeping a maximum of six.
   */
  addAnswer(question: SurveyQuestion): void {
    if (question.answers.length >= 6) {
      return;
    }

    question.answers.push(this.createAnswer());
  }

  /**
   * Removes an answer while keeping at least two.
   */
  removeAnswer(
    question: SurveyQuestion,
    answerId: number,
  ): void {
    if (question.answers.length <= 2) {
      return;
    }

    question.answers = question.answers.filter(
      (answer) => answer.id !== answerId,
    );
  }

  /**
   * Returns the alphabetical label for an answer.
   */
  getAnswerLabel(index: number): string {
    let label = '';

    do {
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);

    return label;
  }

  // CLEAR SURVEY FIELDS

  clearSurveyName(): void {
    this.surveyName = '';
  }

  clearSurveyEndDate(): void {
    this.surveyEndDate = '';
  }

  clearSurveyDescription(): void {
    this.surveyDescription = '';
  }

  // CREATE SURVEY CATEGORY FUNCTIONS

  toggleSurveyCategory(): void {
    this.surveyCategoryOpen = !this.surveyCategoryOpen;
  }

  selectSurveyCategory(category: string): void {
    this.surveyCategory = category;
    this.surveyCategoryOpen = false;
  }

  // PUBLISH TOAST FUNCTIONS

  showPublishToast(): void {
    if (this.publishToastVisible || !this.isDraftValid()) return;
    this.closeValidationToast();
    const survey = this.buildPublishedSurvey();
    this.surveys.push(survey);
    this.currentSurvey = survey;
    if (!this.categories.includes(survey.category)) {
      this.categories.push(survey.category);
    }
    this.saveSurveys();
    this.publishToastVisible = true;
  }

  closeValidationToast(): void {
    this.validationToastVisible = false;
  }

  private isDraftValid(): boolean {
    const valid = this.surveyName.trim() && this.surveyCategory &&
      this.questions.every((question) => question.text.trim() &&
        question.answers.every((answer) => answer.text.trim()));
    if (!valid) {
      this.validationToastVisible = true;
    }
    return Boolean(valid);
  }

  private buildPublishedSurvey(): Survey {
    return {
      id: this.nextSurveyId++,
      title: this.surveyName.trim(),
      category: this.surveyCategory,
      description: this.surveyDescription.trim(),
      endDate: this.surveyEndDate,
      daysLeft: this.calculateDaysLeft(),
      status: 'active',
      questions: this.questions.map((question) => this.toResultQuestion(question)),
      completed: false,
    };
  }

  private calculateDaysLeft(): number {
    if (!this.surveyEndDate) return 0;
    const end = new Date(this.surveyEndDate + 'T23:59:59');
    return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
  }

  private toResultQuestion(question: SurveyQuestion): ResultQuestion {
    return {
      id: question.id,
      text: question.text.trim(),
      multipleAnswers: question.multipleAnswers,
      answers: question.answers.map((answer) => ({
        text: answer.text.trim(),
        votes: 0,
        selected: false,
      })),
    };
  }

  closePublishToast(): void {
    this.publishToastVisible = false;
    if (!this.currentSurvey) return;
    this.openSurvey(this.currentSurvey.id);
    this.resetDraft();
    this.activeTab = 'active';
    this.selectedCategory = 'All Surveys';
  }

  private resetDraft(): void {
    this.surveyName = '';
    this.surveyEndDate = '';
    this.surveyCategory = '';
    this.surveyDescription = '';
    this.surveyCategoryOpen = false;
    this.questions = [this.createQuestion()];
  }

  // SINGLE SURVEY ANSWER SELECTION

  /**
   * Selects or deselects an answer.
   */
  toggleResultAnswer(
    question: ResultQuestion,
    answer: ResultAnswer,
  ): void {
    if (this.surveyCompleted) return;

    const wasSelected = answer.selected;

    if (!question.multipleAnswers) {
      this.clearResultSelections(question);
    }

    answer.selected = !wasSelected;
  }

  /**
   * Clears all selections for one question.
   */
  private clearResultSelections(
    question: ResultQuestion,
  ): void {
    question.answers.forEach((answer) => {
      answer.selected = false;
    });
  }

  // LIVE RESULT CALCULATIONS

  /**
   * Returns the total number of votes for a question.
   */
  getTotalVotes(question: ResultQuestion): number {
    return question.answers.reduce(
      (total, answer) => total + answer.votes,
      0,
    );
  }

  /**
   * Calculates an answer's percentage of all votes.
   */
  getAnswerPercentage(
    question: ResultQuestion,
    answer: ResultAnswer,
  ): number {
    const totalVotes = this.getTotalVotes(question);

    if (totalVotes === 0) {
      return 0;
    }

    return Math.round((answer.votes / totalVotes) * 100);
  }

  // COMPLETE SURVEY

  /**
   * Checks whether every question has an answer.
   */
  canCompleteSurvey(): boolean {
    return this.resultQuestions.every((question) =>
      question.answers.some((answer) => answer.selected),
    );
  }

  /**
   * Submits the selected answers once.
   */
  completeSurvey(): void {
    if (this.surveyCompleted || !this.canCompleteSurvey()) {
      return;
    }

    this.resultQuestions.forEach((question) => {
      this.addQuestionVotes(question);
    });

    this.surveyCompleted = true;
    if (this.currentSurvey) this.currentSurvey.completed = true;
    this.saveSurveys();
  }

  /**
   * Adds votes to the selected answers.
   */
  private addQuestionVotes(question: ResultQuestion): void {
    question.answers.forEach((answer) => {
      if (answer.selected) {
        answer.votes++;
      }
    });
  }
}