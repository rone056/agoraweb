import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '@models/language';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  languages: Language[] = [
    {label: 'Français', value: 'fr'},
    {label: 'English', value: 'en'}
  ];
  selectedLanguage = this.languages[0];
  isMobileMenuOpen = false;
  isMobileLanguageMenuOpen = false;

  constructor(public translate: TranslateService) {
    translate.addLangs(['fr','en']);
    translate.setDefaultLang('fr');
    translate.use(this.selectedLanguage.value);
  }

  setLanguage(language: Language){
    this.selectedLanguage = language
    this.translate.use(language.value);
    this.isMobileLanguageMenuOpen = false;
  }

  setMenuVisibility(){
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isMobileLanguageMenuOpen = false;
  }

  ngOnInit(): void {
  }

}
