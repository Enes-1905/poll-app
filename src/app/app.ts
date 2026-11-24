import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Survey {
  id: number;
  category: string;
  title: string;
  daysLeft: number;
  status: 'active' | 'past';
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
// CATEGORY DROPDOWN (CREATE SURVEY)

surveyCategoryOpen = false;

surveyCategoryOptions = [
  'Team Activities',
  'Health & Wellness',
  'Gaming & Entertainment',
  'Education & Learning',
  'Lifestyle & Preferences',
  'Technology & Innovation',
];

  private nextQuestionId = 1;
  private nextAnswerId = 1;

  questions: SurveyQuestion[] = [
    this.createQuestion(),
  ];

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
    this.currentPage = 'home';
  }

  /**
   * Opens a selected survey.
   */
  openSurvey(id: number): void {
    // Single Survey page will be implemented later.
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
   * Adds an answer to the selected question.
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
showPublishToast(): void {
  this.publishToastVisible = true;
}

closePublishToast(): void {
  this.publishToastVisible = false;
  this.currentPage = 'single-survey';
}
}