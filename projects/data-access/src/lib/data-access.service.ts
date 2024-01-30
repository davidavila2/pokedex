import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, delay, forkJoin, map, mergeMap, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  BASE_URL = 'https://pokeapi.co/api/v2';

  callState = signal<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });
  pageInfo = signal<{ count: number; next: string; previous: string }>({
    count: 0,
    next: '',
    previous: '',
  });
  nextUrl = signal<string>('');
  previousUrl = signal<string>('');

  constructor(private http: HttpClient) {}

  getUrl(): string {
    return this.BASE_URL;
  }

  getPokemonDetails(id: string) {
    this.callState.set({ loading: true, error: null });
    return this.http.get(`${this.BASE_URL}/pokemon/${id}`).pipe(
      tap(() => this.callState.set({ loading: false, error: null })),
      catchError((error) => {
        this.callState.set({ loading: false, error: error.message });
        throw error;
      })
    );
  }

  getPokemon() {
    this.callState.set({ loading: true, error: null });
    return this.http.get(`${this.BASE_URL}/pokemon?limit=15`).pipe(
      tap(
        (originalPokeResponse: any) => (
          this.nextUrl.set(originalPokeResponse.next),
          this.pageInfo.set({
            count: originalPokeResponse.count,
            next: originalPokeResponse.next,
            previous: originalPokeResponse.previous,
          }),
          this.callState.set({ loading: false, error: null })
        )
      ),
      this.pokemonRequestTransformer(),
      catchError((error) => {
        this.callState.set({ loading: false, error: error.message });
        throw error;
      })
    );
  }

  getNextPokemon() {
    this.callState.set({ loading: true, error: null });
    return this.http.get(this.nextUrl()).pipe(
      tap(
        (originalPokeResponse: any) => (
          this.nextUrl.set(originalPokeResponse.next),
          this.previousUrl.set(originalPokeResponse.previous),
          this.pageInfo.set({
            count: originalPokeResponse.count,
            next: originalPokeResponse.next,
            previous: originalPokeResponse.previous,
          }),
          this.callState.set({ loading: false, error: null })
        )
      ),
      this.pokemonRequestTransformer(),
      catchError((error) => {
        this.callState.set({ loading: false, error: error.message });
        throw error;
      })
    );
  }

  getPreviousPokemon() {
    this.callState.set({ loading: true, error: null });
    return this.http.get(this.previousUrl()).pipe(
      tap(
        (originalPokeResponse: any) => (
          this.nextUrl.set(originalPokeResponse.next),
          this.previousUrl.set(originalPokeResponse.previous),
          this.pageInfo.set({
            count: originalPokeResponse.count,
            next: originalPokeResponse.next,
            previous: originalPokeResponse.previous,
          }),
          this.callState.set({ loading: false, error: null })
        )
      ),
      this.pokemonRequestTransformer(),
      catchError((error) => {
        this.callState.set({ loading: false, error: error.message });
        throw error;
      })
    );
  }

  private specificProperties(poke: any) {
    const { name, id, sprites } = poke;

    return { id, name, sprites };
  }

  private unwrapEachObservableInArray(arrayOfResults: any[]) {
    return forkJoin(
      arrayOfResults.map((eachPokeInTheArray) =>
        this.http.get(eachPokeInTheArray.url)
      )
    );
  }

  private pokemonRequestTransformer() {
    return pipe(
      map((originalPokeResponse: any) => originalPokeResponse.results),
      mergeMap((arrayOfAllResults: any) =>
        this.unwrapEachObservableInArray(arrayOfAllResults)
      ),
      map((arrayOfPokeObjects) =>
        arrayOfPokeObjects.map((fullPokeObject) =>
          this.specificProperties(fullPokeObject)
        )
      )
    );
  }
}
