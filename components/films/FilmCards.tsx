"use client";

import { useState } from "react";
import type { FilmView } from "@/types/filmView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { FilmsResource } from "@/lib/swapi/resources";
import { TableLoadingState } from "../resource-table/TableLoadingState";
import { Tag } from "../Tag";

// ---------------------------------------------------------------------------
// FilmCard — a single film panel
// ---------------------------------------------------------------------------

const CRAWL_TRUNCATE_LENGTH = 150;

function FilmCard({ film }: { film: FilmView }) {
  const [crawlExpanded, setCrawlExpanded] = useState(false);

  const crawlText = film.opening_crawl.replace(/\r\n/g, "\n");
  const isLongCrawl = crawlText.length > CRAWL_TRUNCATE_LENGTH;

  return (
    <article className="rounded-lg border border-foreground/10 bg-foreground/5 p-5 flex flex-col gap-4">
      {/* Header: Episode + Title */}
      <header>
        <p className="text-sm font-medium text-foreground/50">
          Episode {film.episode_id}
        </p>
        <h2 className="text-xl font-bold">{film.title}</h2>
      </header>

      {/* Metadata */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="font-medium text-foreground/60">Director</dt>
        <dd>{film.director}</dd>

        <dt className="font-medium text-foreground/60">Producer(s)</dt>
        <dd className="flex flex-wrap gap-1">
          {film.producer.map((p) => <Tag key={p}>{p}</Tag>)}
        </dd>

        <dt className="font-medium text-foreground/60">Released</dt>
        <dd>{film.release_date}</dd>
      </dl>

      {/* Opening Crawl */}
      <div>
        <h3 className="text-sm font-medium text-foreground/60 mb-1">
          Opening Crawl
        </h3>
        <p className="text-sm whitespace-pre-line leading-relaxed">
          {!crawlExpanded && isLongCrawl
            ? crawlText.slice(0, CRAWL_TRUNCATE_LENGTH) + "..."
            : crawlText}
        </p>
        {isLongCrawl && (
          <button
            className="text-sm text-blue-600 dark:text-blue-400 mt-1 hover:underline"
            onClick={() => setCrawlExpanded(!crawlExpanded)}
          >
            {crawlExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Related Resource Counts */}
      <div>
        <h3 className="text-sm font-medium text-foreground/60 mb-1">
          Related
        </h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <Tag>{film.characters.length} Characters</Tag>
          <Tag>{film.planets.length} Planets</Tag>
          <Tag>{film.starships.length} Starships</Tag>
          <Tag>{film.vehicles.length} Vehicles</Tag>
          <Tag>{film.species.length} Species</Tag>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// FilmCards — the full grid with loading state
// ---------------------------------------------------------------------------

export default function FilmCards() {
  const films = useSwapiResource(FilmsResource);

  const sortedFilms = films.data
    ? [...films.data].sort((a, b) => a.episode_id - b.episode_id)
    : null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 mb-4">
        <button
          className="font-bold rounded bg-foreground/10 px-2 py-1 hover:bg-foreground/20"
          onClick={() => films.refetch(true)}
        >
          Refresh
        </button>
        <div>
          <TableLoadingState resource={films} />
        </div>
      </div>

      {/* Responsive card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {sortedFilms?.map((film) => <FilmCard key={film.url} film={film} />)}
      </div>
    </div>
  );
}
