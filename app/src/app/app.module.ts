import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule, 
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ComponentsModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    SwiperModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
