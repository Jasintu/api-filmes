import { Component, OnInit, HostListener } from '@angular/core';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  movie: string = '';
  movieResults: any[] = [];
  currentPage: number = 1;
  loading: boolean = false;
  img: object = {};
  title: object = {};
  overview: object = {};
  vote_average: number = 0;
  release_date: string = "";
  isVisible: boolean = true;
  isVisible2: boolean = false;

  constructor(private movieService: ApiServiceService) {}

  ngOnInit(): void {
    this.loadMoreMovies();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (!this.loading && this.isScrolledToBottom()) {
      this.loadMoreMovies();
    }
  }

  loadMoreMovies() {
    this.loading = true;
    this.movieService.getTopRatedMovies(this.currentPage).subscribe(
      movies => {
        this.movieResults = this.movieResults.concat(movies);
        this.currentPage++;
        this.loading = false;
      },
      error => {
        console.error('Erro ao obter os filmes mais bem avaliados:', error);
        this.loading = false;
      }
    );
  }

  isScrolledToBottom(): boolean {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    return windowBottom >= docHeight;
  }

  pesquisarFilme(): void {
    this.movieService.searchMoviesByTitle(this.movie).subscribe(
      data => {
        if (data && data.length > 0) { 
          this.movieResults = data;
        } else {
          this.movieService.searchMoviesByTitle(this.movie).subscribe(
            dataEN => {
              if (dataEN && dataEN.length > 0) { 
                this.movieResults = dataEN;
              } else { 
                this.movieResults = [];
              }
            },
            errorEN => {
              console.error('Erro ao pesquisar filme em inglês:', errorEN);
              this.movieResults = [];
            }
          );
        }
      },
      error => {
        console.error('Erro ao pesquisar filme em português:', error);
        this.movieResults = [];
      }
    );
  }

  details(movie:any){
    this.isVisible = false
    this.isVisible2 = true;
    this.img = movie.poster_path
    this.title = movie.title
    this.overview  = movie.overview    
    this.vote_average = movie.vote_average
    this.release_date = movie.release_date
  }

  back(){
    this.isVisible2 = false;
    this.isVisible = true;
  }
  
}
