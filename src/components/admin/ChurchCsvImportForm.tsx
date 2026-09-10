"use client";

import { useState, useTransition, type FormEvent } from "react";
import { importChurchesCsv, type ActionState } from "@/app/admin/churches/actions";
import { Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

// Sourced from the RBA church directory (baptisti.org/biserici/) as a
// starting point for the committee to review/edit, not asserted as
// authoritative or current. Upserted on (name, city_state) since the same
// church name recurs across many different cities.
const RBA_CHURCH_DIRECTORY = `First Romanian Baptist Church|Phoenix, AZ|Ovidiu Horga|(602) 515-3225|www.frbcaz.com
Bethany Romanian Baptist Church|La Habra, CA|Claudiu Manole|(562) 217-8687|www.bethanyromanianla.com
Bethel Romanian Baptist Church|Anaheim, CA|Daniel Branzei / Doru Brezoi / Valer Monafu|(714) 535-2550|Betheloc.org
Bethel Romanian Baptist Church|Sacramento, CA|Doru Aninoiu|(916) 308-3670|
Faith Romanian Baptist Church|Hayward, CA|Iosif Sarac|(510) 537-4716|
Golgota Romanian Baptist Church|San Ramon, CA|Ioan Pascut|(925) 828-8005|
Grace Romanian Baptist Church|Sacramento, CA|Daniel Lavric|(916) 483-7744|www.graceromanianbaptistchurch.org
Romanian Baptist Church of the San Francisco Bay Area|San Leandro, CA|Ovidiu Rauca|(510) 614-9282|www.rbcsanfrancisco.org
Speranta Romanian Baptist Church|Rancho Cordova, CA|Victor Saharnean|(916) 821-2957|
The Way of the Cross Romanian Baptist Church|Colton, CA||(909) 825-2776|www.thewayofthecrossca.org/ro
Romanian Baptist Church|Wheat Ridge, CO|||
Betania Romanian Baptist Church|Jacksonville, FL|Cristian Talpos||
First Romanian Baptist Church|Lake Worth, FL||(561) 586-8419|frbcwpb.com
Grace Romanian Baptist Church|Hollywood, FL|Marian Chirla|(954) 920-7527|graceromanianbaptist.com
Grace Romanian Baptist Church of Naples|Naples, FL||(239) 595-8323|grbcn.org
New Life Romanian Baptist Church|Hollywood, FL|Florin Vancea / George Dancea|(954) 920-3614|newliferbc.com
Conyers Romanian Baptist Fellowship|Conyers, GA|Igor Coada|(770) 929-0152|
Eben-Ezer Romanian Baptist Church|Lawrenceville, GA|||
First Romanian Baptist Church|Roswell, GA|Cristi Cocian|(770) 992-4274|
Gwinnett Romanian Baptist Church|Buford, GA|Matei Istudor|(678) 421-4722|www.grbcatlanta.com
Betel Romanian Baptist Church|Park Ridge, IL|Valentin Popovici / Peter Ordeanu||www.betelchurch.org
First Romanian Baptist Church|Chicago, IL|Ionut Deliu-Zaharie|(773) 525-8844|firstrbc-chicago.org
Romanian Baptist Church of Metropolitan Chicago|Des Plaines, IL|Adrian Neiconi|(847) 824-0182|www.rbc-chicago.org
Providence Moldovian Baptist Church|Greenfield, MA|Simion Placinta||providencegbc.net
First Romanian Baptist Church|Troy, MI|Sorin Covaci|(248) 524-2160|www.frbc-troy.com
Golgota Romanian Baptist Church|Warren, MI|Ștefan Ghinescu|(586) 755-1565|biserica.com
Romanian Baptist Church|Blain, MN|Simeon Daskalyuk||
First Romanian Baptist Church|Ridgewood, NY|Levi Marian|(718) 381-2208|
Maranatha Romanian Baptist Church|Ridgewood, NY|Emanuel Grozea|(347) 408-0650|www.maranatha.nyc
Biserica Baptistă Română Harul|Las Vegas, NV|Marius Lucan|(909) 677-3337|
Bethel Romanian Baptist Church|Asheville, NC|||
Romanian Baptist Church|Hickory, NC|Vali Tent|(828) 294-6131|www.romanianbaptist.com
Romanian Baptist Church of Charlotte|Charlotte, NC|Livius Percy / Radu Știr|(704) 562-2339|www.rombcc.com
Romanian Bible Baptist Church|Greenville, SC|Petrică Muresan|(864) 895-8152|www.romanianbaptistchurchgreenville.com
Romanian Baptist Church|Canton, OH|Tudor Sandu Peshel|(330) 649-0319|
Romanian Baptist Church|Seven Hills, OH|Dan Paul|(216) 642-3131|clevelandrbc.com
Romanian Baptist Church|Uniontown, OH|Mihai Cabău|(330) 903-3157|rbc-akron.org
Romanian Baptist Church|Beaverton, OR|Eusebiu Rusu|(503) 310-4979|www.rbcbeaverton.org
Romanian Baptist Church of Portland|Portland, OR|Ciprian Ardelean|(503) 785-0372|www.rbcportland.com
Jesus the Savior Romanian Baptist Church|Collegesville, PA|Dumitru Toderic|(610) 488-0565|
First Romanian Baptist Church|Nashville, TN|Lucian Rad|(615) 391-4702|
Logos Romanian Baptist Church|Nashville, TN|Nelu Gug / Samuel Stan||
Bethesda Romanian Baptist Church|Porter, TX|Marius Maduta||bethesdarbc.org
First Romanian Baptist Church|Humble, TX|Claudiu Valcu||houstonfrbc.org
Grace Romanian Baptist Church|Euless, TX|Vali Ciortan||graceromanianchurch.com
Prestonwood Romanian Baptist Church|Plano, TX|Marin Tomulet|(972) 820-5000|
Romanian Baptist Church of Houston|Kingwood, TX|Ioan Stir|(832) 725-6877|
Sion Romanian Baptist Church|San Antonio, TX||(210) 455-2917|sionrbc.org
First Romanian Baptist Church|Stafford, VA||(540) 288-7520|www.frbvirginia.org
Golgotha Baptist Church|Tacoma, WA|Pavel Sandu|(253) 222-7196|golgotambc.org
Good News Romanian Baptist Church|Kirkland, WA|Marius Teodoru|(425) 747-4808|gnrbc.com
Romanian Baptist Church of Vancouver|Vancouver, WA||(360) 635-7388|www.rbcvancouverwa.com
Emanuel Romanian Baptist Church|Port Coquitlam, BC|Daniel Mihoc|(425) 691-0118|www.bisericaemanuel.ca
Bethel Baptist Church|Kitchener, ON|Florin Dragomir|(519) 893-7604|
First Romanian Baptist Church|Kitchener, ON|Daniel Purza|(519) 579-1741|www.frbckw.ca
First Romanian Baptist Church|Windsor, ON||(226) 975-2534|www.frbcwindsor.com
Hope Romanian Baptist Church|Kitchener, ON|Ioan Raca||hoperombc.weebly.com
Romanian Baptist Church|North York, ON|Mircea Toma|(416) 803-7794|www.bisericabaptistatoronto.org
Romanian Baptist Church|Hamilton, ON|Petar Marcuci||
First Romanian Baptist Church of Montreal|Laval des Rapides, QC||(450) 669-9345|
First Romanian Baptist Church in Australia|Endeavour Hills, VIC|Teofil Ciortuz||www.frbc.org.au`;

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
        rows that don&apos;t apply. Re-running this is safe: matching
        (name, city/state) rows are updated in place rather than duplicated.
      </p>

      {result && (
        <Banner tone={result.status === "error" ? "error" : "success"}>{result.message}</Banner>
      )}

      <div>
        <Label htmlFor="churches-csv" hint="one per line: name|city, ST|pastor name|phone|website">
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
