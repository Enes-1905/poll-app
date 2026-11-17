import { Component } from '@angular/core';

interface Survey {
  id: number;
  category: string;
  title: string;
  daysLeft: number;
  status: 'active' | 'past';
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  currentPage: 'home' | 'create-survey' = 'home';

  activeTab: 'active' | 'past' = 'active';

  categoriesOpen = false;

  selectedCategory = 'All Surveys';

  categories = [
    'All Surveys',
    'Team activities',
    'Gaming',
    'Healthy Lifestyle',
  ];

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
   * Navigation will be implemented later.
   */
  openSurvey(id: number): void {
    // Single Survey page will be implemented later.
  }
}