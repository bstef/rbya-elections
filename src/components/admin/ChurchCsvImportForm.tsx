"use client";

import { useState, useTransition, type FormEvent } from "react";
import { importChurchesCsv, type ActionState } from "@/app/admin/churches/actions";
import { Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

// Sourced from the RBA church directory (baptisti.org/biserici/) as a
// starting point for the committee to review/edit, not asserted as
// authoritative or current.
const RBA_CHURCH_DIRECTORY = `First Romanian Baptist Church|Phoenix, AZ|Ovidiu Horga
Bethany Romanian Baptist Church|La Habra, CA|Claudiu Manole
Bethel Romanian Baptist Church|Anaheim, CA|Daniel Branzei / Doru Brezoi / Valer Monafu
Bethel Romanian Baptist Church|Sacramento, CA|Doru Aninoiu
Faith Romanian Baptist Church|Hayward, CA|Iosif Sarac
Golgota Romanian Baptist Church|San Ramon, CA|Ioan Pascut
Grace Romanian Baptist Church|Sacramento, CA|Daniel Lavric
Romanian Baptist Church of the San Francisco Bay Area|San Leandro, CA|Ovidiu Rauca
Speranta Romanian Baptist Church|Rancho Cordova, CA|Victor Saharnean
The Way of the Cross Romanian Baptist Church|Colton, CA|
Romanian Baptist Church|Wheat Ridge, CO|
Betania Romanian Baptist Church|Jacksonville, FL|Cristian Talpos
First Romanian Baptist Church|Lake Worth, FL|
Grace Romanian Baptist Church|Hollywood, FL|Marian Chirla
Grace Romanian Baptist Church of Naples|Naples, FL|
New Life Romanian Baptist Church|Hollywood, FL|Florin Vancea / George Dancea
Conyers Romanian Baptist Fellowship|Conyers, GA|Igor Coada
Eben-Ezer Romanian Baptist Church|Lawrenceville, GA|
First Romanian Baptist Church|Roswell, GA|Cristi Cocian
Gwinnett Romanian Baptist Church|Buford, GA|Matei Istudor
Betel Romanian Baptist Church|Park Ridge, IL|Valentin Popovici / Peter Ordeanu
First Romanian Baptist Church|Chicago, IL|Ionut Deliu-Zaharie
Romanian Baptist Church of Metropolitan Chicago|Des Plaines, IL|Adrian Neiconi
Providence Moldovian Baptist Church|Greenfield, MA|Simion Placinta
First Romanian Baptist Church|Troy, MI|Sorin Covaci
Golgota Romanian Baptist Church|Warren, MI|Ștefan Ghinescu
Romanian Baptist Church|Blain, MN|Simeon Daskalyuk
First Romanian Baptist Church|Ridgewood, NY|Levi Marian
Maranatha Romanian Baptist Church|Ridgewood, NY|Emanuel Grozea
Biserica Baptistă Română Harul|Las Vegas, NV|Marius Lucan
Bethel Romanian Baptist Church|Asheville, NC|
Romanian Baptist Church|Hickory, NC|Vali Tent
Romanian Baptist Church of Charlotte|Charlotte, NC|Livius Percy / Radu Știr
Romanian Bible Baptist Church|Greenville, SC|Petrică Muresan
Romanian Baptist Church|Canton, OH|Tudor Sandu Peshel
Romanian Baptist Church|Seven Hills, OH|Dan Paul
Romanian Baptist Church|Uniontown, OH|Mihai Cabău
Romanian Baptist Church|Beaverton, OR|Eusebiu Rusu
Romanian Baptist Church of Portland|Portland, OR|Ciprian Ardelean
Jesus the Savior Romanian Baptist Church|Collegesville, PA|Dumitru Toderic
First Romanian Baptist Church|Nashville, TN|Lucian Rad
Logos Romanian Baptist Church|Nashville, TN|Nelu Gug / Samuel Stan
Bethesda Romanian Baptist Church|Porter, TX|Marius Maduta
First Romanian Baptist Church|Humble, TX|Claudiu Valcu
Grace Romanian Baptist Church|Euless, TX|Vali Ciortan
Prestonwood Romanian Baptist Church|Plano, TX|Marin Tomulet
Romanian Baptist Church of Houston|Kingwood, TX|Ioan Stir
Sion Romanian Baptist Church|San Antonio, TX|
First Romanian Baptist Church|Stafford, VA|
Golgotha Baptist Church|Tacoma, WA|Pavel Sandu
Good News Romanian Baptist Church|Kirkland, WA|Marius Teodoru
Romanian Baptist Church of Vancouver|Vancouver, WA|
Emanuel Romanian Baptist Church|Port Coquitlam, BC|Daniel Mihoc
Bethel Baptist Church|Kitchener, ON|Florin Dragomir
First Romanian Baptist Church|Kitchener, ON|Daniel Purza
First Romanian Baptist Church|Windsor, ON|
Hope Romanian Baptist Church|Kitchener, ON|Ioan Raca
Romanian Baptist Church|North York, ON|Mircea Toma
Romanian Baptist Church|Hamilton, ON|Petar Marcuci
First Romanian Baptist Church of Montreal|Laval des Rapides, QC|
First Romanian Baptist Church in Australia|Endeavour Hills, VIC|Teofil Ciortuz`;

export function ChurchCsvImportForm() {
  const [csvText, setCsvText] = useState(RBA_CHURCH_DIRECTORY);
  const [result, setResult] = useState<ActionState | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      setResult(await importChurchesCsv(csvText));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-ink-muted">
        Prefilled with the RBA church directory from{" "}
        <a
          href="https://baptisti.org/biserici/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          baptisti.org
        </a>{" "}
        -- review names/pastors before importing, and edit or remove any
        rows that don&apos;t apply. Re-running this is safe: matching church
        names are updated in place rather than duplicated.
      </p>

      {result && (
        <Banner tone={result.status === "error" ? "error" : "success"}>{result.message}</Banner>
      )}

      <div>
        <Label htmlFor="churches-csv" hint="one per line: name|city, ST|pastor name">
          Churches
        </Label>
        <Textarea
          id="churches-csv"
          rows={12}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isPending || !csvText.trim()}>
        {isPending ? "Importing..." : "Import churches"}
      </Button>
    </form>
  );
}
