import { Component, OnInit, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnChanges, OnInit{
  movie: string = '';
  movieResults: any[] = [];
  currentPage: number = 1;
  loading: boolean = false;
  isVisible: Boolean = true;
  isVisible2: Boolean = false;
  img: object = {};
  title: object = {};
  overview: object = {};
  vote_average: number = 0;
  release_date: string = "";
  @Input() valorRecebido!: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.movie = this.valorRecebido;
    this.pesquisarFilme();
  }
  
  ngOnInit(): void {
    this.pesquisarFilme();
  }

  details(movie:any){
    this.isVisible = false
    this.isVisible2 = true;
    this.img = movie.poster_path
    this.title = movie.title
    this.overview  = movie.overview    
    this.vote_average = movie.vote_average
    this.release_date = movie.release_date
    console.log(movie)
  }

  back(){
    this.isVisible2 = false;
    this.isVisible = true;
  }

  constructor(private movieService: ApiServiceService) {}

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
}
