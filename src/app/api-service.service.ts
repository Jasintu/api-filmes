import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  getMovies() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'fbfb8497213f20af0c55a11ff5407571';
  private accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYmZiODQ5NzIxM2YyMGFmMGM1NWExMWZmNTQwNzU3MSIsInN1YiI6IjY2MjAxOTVlNTI4YjJlMDE0YTNlYzYyZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vbwFg0I6r8-BZoXyeSygCH79_4JgzQD4j-0cEYiCzBs';
  private userId = '21219626';

  constructor(private http: HttpClient) { }

  searchMoviesByTitle(title: string): Observable<any[]> {
    const languagePT = 'pt-BR';
    const languageEN = 'en-US';
    const searchPT = this.http.get<any>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${title}&language=${languagePT}`)
    .pipe(
      catchError(error => {
        console.error('Erro na pesquisa em português:', error);
        return of(null);
      })
    );
    const searchEN = searchPT.pipe(
      catchError(() => {
        console.log('Tentando pesquisar em inglês...');
        return this.http.get<any>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${title}&language=${languageEN}`);
      })
    );
    return forkJoin([searchPT, searchEN]).pipe(
      map(([resultsPT, resultsEN]) => {
        this.adjustMovieTitles(resultsPT);
        return resultsPT && resultsPT.results && resultsPT.results.length > 0 ? resultsPT.results : resultsEN.results || [];
      })
    );
  }

  private adjustMovieTitles(results: any): void {
    if (results && results.results) {
      results.results.forEach((movie: { title: string; }) => {
        if (movie.title.length > 25) {
          movie.title = movie.title.substring(0, 25) + '...';
        }
      });
    }
  }


  getTopRatedMovies(page: number = 1): Observable<any[]> {
    const language = 'pt-BR';
    return this.http.get<any>(`${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&language=${language}&page=${page}`)
      .pipe(
        map(response => {
          const results = response.results;
          this.adjustMovieTitlesHome(results); // Chamando a função para ajustar os títulos dos filmes
          return results;
        }),
        catchError(error => {
          console.error('Erro ao obter os filmes mais bem avaliados:', error);
          return of([]);
        })
      );
  }
  
  private adjustMovieTitlesHome(results: any[]): void {
    if (results) {
      results.forEach(movie => {
        if (movie.title.length > 25) {
          movie.title = movie.title.substring(0, 25) + '...'; // Reduzindo para 12 caracteres para deixar espaço para os "..."
        }
      });
    }
  }
  
}
  
  

