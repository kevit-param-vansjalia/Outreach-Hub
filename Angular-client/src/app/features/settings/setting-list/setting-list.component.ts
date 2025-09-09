import { Component, OnInit } from '@angular/core';

export interface NavigationItem {
  id: string;
  name: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  dribbble: string;
  language: string;
  currency: string;
  theme: string;
  avatar: string;
  integration: {
    provider: string;
    email: string;
    connected: boolean;
  };
}

export interface ThemeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-settings-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss']
})
export class SettingsListComponent implements OnInit {
  activeTab: string = 'general';

  navigationItems: NavigationItem[] = [
    { id: 'general', name: 'General' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'billing', name: 'Billing plans' },
    { id: 'security', name: 'Login & security' },
    { id: 'members', name: 'Members' },
    { id: 'roles', name: 'User roles' }
  ];

  themeOptions: ThemeOption[] = [
    { value: 'light', label: 'Light mode' },
    { value: 'dark', label: 'Dark mode' },
    { value: 'auto', label: 'Auto' }
  ];

  userProfile: UserProfile = {
    name: 'Alex Jackson',
    phone: '+12312321792',
    email: 'finalui@yandex.com',
    linkedin: 'linkedin.com/company/finalui',
    dribbble: 'dribbble.com/final-ui',
    language: 'English',
    currency: 'USD',
    theme: 'light',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    integration: {
      provider: 'Google',
      email: 'exampleemail@gmail.com',
      connected: true
    }
  };

  constructor() { }

  ngOnInit(): void { }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getActiveTabName(): string {
    const activeItem = this.navigationItems.find(item => item.id === this.activeTab);
    return activeItem ? activeItem.name : 'General';
  }

  editField(fieldType: string): void {
    switch (fieldType) {
      case 'name': this.editName(); break;
      case 'contacts': this.editContacts(); break;
      case 'social': this.editSocialMedia(); break;
      case 'language': this.editLanguageAndCurrency(); break;
      default: break;
    }
  }

  private editName(): void {
    const newName = prompt('Enter new name:', this.userProfile.name);
    if (newName?.trim()) this.userProfile.name = newName.trim();
  }

  private editContacts(): void {
    const newPhone = prompt('Enter new phone:', this.userProfile.phone);
    const newEmail = prompt('Enter new email:', this.userProfile.email);
    if (newPhone?.trim()) this.userProfile.phone = newPhone.trim();
    if (newEmail?.trim()) this.userProfile.email = newEmail.trim();
  }

  private editSocialMedia(): void {
    const newLinkedin = prompt('Enter LinkedIn URL:', this.userProfile.linkedin);
    const newDribbble = prompt('Enter Dribbble URL:', this.userProfile.dribbble);
    if (newLinkedin?.trim()) this.userProfile.linkedin = newLinkedin.trim();
    if (newDribbble?.trim()) this.userProfile.dribbble = newDribbble.trim();
  }

  private editLanguageAndCurrency(): void {
    const newLanguage = prompt('Enter language:', this.userProfile.language);
    const newCurrency = prompt('Enter currency:', this.userProfile.currency);
    if (newLanguage?.trim()) this.userProfile.language = newLanguage.trim();
    if (newCurrency?.trim()) this.userProfile.currency = newCurrency.trim();
  }

  onThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.applyTheme(target.value);
  }

  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  uploadAvatar(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => this.userProfile.avatar = e.target?.result as string;
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  }

  deleteAvatar(): void {
    if (confirm('Are you sure you want to delete your avatar?')) {
      this.userProfile.avatar = 'https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=No+Avatar';
    }
  }

  toggleIntegration(): void {
    this.userProfile.integration.connected = !this.userProfile.integration.connected;
  }

  saveChanges(): void { console.log('Saving changes:', this.userProfile); }
  resetChanges(): void { console.log('Resetting changes'); }
}
