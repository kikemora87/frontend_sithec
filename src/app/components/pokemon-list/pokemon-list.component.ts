import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { PokemonDetail } from '../../models/pokemon.detail';
import { PokemonList } from '../../models/pokemon.list';
import { PokemonService } from 'src/app/services/pokemon.services';
import { PokemonDetailsComponent } from '../pokemon-details/pokemon-details.component';


@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.sass']
})
export class PokemonListComponent implements OnInit {

  search: FormControl = new FormControl('');
  pokemons: PokemonDetail[] = [];
  classicMode = true;

  private offset: number;
  isLoading=false;
  isLastPage = false;

  searchPokemon: any;
  isSearching = false;

  constructor(private pokemonService: PokemonService,
              private bottomSheet: MatBottomSheet,
              private snackBar: MatSnackBar) { 
                this.offset = 0 ;
              }

  ngOnInit(): void {
    this.getPage(this.offset);
    
  }

  getPage(offset: number) {
    if(!this.isLoading && !this.isLastPage) {
      this.isLoading = true;
      this.pokemonService.getPokemonList(offset)
      .subscribe((list: PokemonList[]) => {
        if(list.length === 0) {
          this.isLastPage = true;
        }

        if(!this.isLastPage) {
          this.getPokemon(list);
        }
      });
    }
  }

  onSearchPokemon(): void {
    const value = this.search.value;
    if(value === '') {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      this.isLoading = true;
      this.pokemonService.getPokemonDetail(value)
      .subscribe((pokemon: PokemonDetail) => {
        this.searchPokemon = pokemon;
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        if(error.status === 404) {
          this.snackBar.open('Sorry, Pokemon not found', 'Ok', {
            duration: 5000,
          });
        }
      })
    }
  }

  onScroll(event: Event): void {
    const element: HTMLDivElement = event.target as HTMLDivElement;
    if(element.scrollHeight - element.scrollTop < 1000) {
      this.getPage(this.offset);
    }
  }

  private getPokemon(list: PokemonList[]) {
    const arr: Observable<PokemonDetail>[] = [];
    list.map((value: PokemonList) => {
      arr.push(
        this.pokemonService.getPokemonDetail(value.name)
      );
    });
    
    forkJoin([...arr]).subscribe((pokemons: any) => {
      this.pokemons.push(...pokemons);
      this.offset +=20;
      this.isLoading = false;
    })
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

  onDetail(pokemon: PokemonDetail): void {
    this.bottomSheet.open(PokemonDetailsComponent, {
      data: {pokemon, classicMode: this.classicMode}
    })
  }

}
