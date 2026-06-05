import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Reconstruit le chemin complet d'une route à partir du snapshot racine.
 * Exemple : /pokemon/all, /pokemon/9
 */
function routePath(snapshot: ActivatedRouteSnapshot): string {
    const parts: string[] = [];

    /** Parcourt l'arbre des routes enfants pour assembler les segments d'URL. */
    const walk = (node: ActivatedRouteSnapshot | null) => {
        if (!node) {
            return;
        }
        parts.push(...node.url.map((segment) => segment.path));
        walk(node.firstChild);
    };

    walk(snapshot);
    return '/' + parts.join('/');
}

/**
 * Indique si la transition animée entre deux pages doit être ignorée.
 * - même URL : pas d'animation
 * - même page avec un id différent (ex. /pokemon/4 → /pokemon/5) : pas d'animation
 */
function shouldSkipTransition(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): boolean {
    const fromPath = routePath(from);
    const toPath = routePath(to);

    if (fromPath === toPath) {
        return true;
    }

    const fromPattern = fromPath.replace(/\/\d+/g, '/:id');
    const toPattern = toPath.replace(/\/\d+/g, '/:id');

    return fromPattern === toPattern;
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        provideRouter(routes, withViewTransitions({
            // Pas d'animation au premier chargement de l'application
            skipInitialTransition: true,
            // Appelé à chaque navigation : décide si la View Transition CSS s'exécute
            onViewTransitionCreated: ({ transition, from, to }) => {
                if (shouldSkipTransition(from, to)) {
                    transition.skipTransition?.();
                    return;
                }
            },
        })),
    ],
};
