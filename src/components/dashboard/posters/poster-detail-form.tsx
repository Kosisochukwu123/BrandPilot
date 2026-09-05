"use client";

import { SpotlightCard } from "@/components/dashboard/overview/motion-primitives";

export type PosterDetails = {
  offer: string;
  price: string;
  date: string;
  time: string;
  address: string;
  phone: string;
  website: string;
  extra: string;
};

export type PosterPersonForm = {
  id: string;
  name: string;
  role: string;
  fileName?: string | null;
};

export type PosterType =
  | "church"
  | "event"
  | "product"
  | "business"
  | "real_estate"
  | "other";

export type PosterGoal =
  | "promote"
  | "announce"
  | "sell"
  | "invite"
  | "awareness"
  | "celebrate";

const inputClass =
  "mt-2 w-full rounded-xl border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40";

export function PosterDetailForm({
  details,
  onChange,
  posterType,
  onPosterTypeChange,
  goal,
  onGoalChange,
  mainMessage,
  onMainMessageChange,
  additionalInfo,
  onAdditionalInfoChange,
  logoName,
  imageName,
  onLogo,
  onImage,
  people = [],
  onPersonChange,
  onPersonPhoto,
  onAddPerson,
  onRemovePerson,
}: {
  details: PosterDetails;
  onChange: (key: keyof PosterDetails, value: string) => void;
  posterType: PosterType;
  onPosterTypeChange: (v: PosterType) => void;
  goal: PosterGoal;
  onGoalChange: (v: PosterGoal) => void;
  mainMessage: string;
  onMainMessageChange: (v: string) => void;
  additionalInfo: string;
  onAdditionalInfoChange: (v: string) => void;
  logoName?: string | null;
  imageName?: string | null;
  onLogo: (file: File | null) => void;
  onImage: (file: File | null) => void;
  people?: PosterPersonForm[];
  onPersonChange?: (
    id: string,
    field: "name" | "role",
    value: string,
  ) => void;
  onPersonPhoto?: (id: string, file: File | null) => void;
  onAddPerson?: () => void;
  onRemovePerson?: (id: string) => void;
}) {

  const showOffer =
    posterType === "product" ||
    posterType === "business" ||
    posterType === "real_estate" ||
    posterType === "other";

  const showEvent =
    posterType === "church" ||
    posterType === "event" ||
    posterType === "other";

  const showPeople =
    posterType === "church" ||
    posterType === "event" ||
    posterType === "real_estate" ||
    posterType === "business" ||
    posterType === "other";

  return (
    <SpotlightCard className="p-6">
      {/* ── What are you creating ── */}
      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Tell us what you’re creating
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          Add only what you want included. BrandPilot will decide how to arrange
          it.
        </p>

        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Poster type
          </span>
          <select
            value={posterType}
            onChange={(e) =>
              onPosterTypeChange(e.target.value as PosterType)
            }
            className={inputClass}
          >
            <option value="business">Business / Service</option>
            <option value="church">Church / Ministry</option>
            <option value="event">Event</option>
            <option value="product">Product / Sale</option>
            <option value="real_estate">Real Estate</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            What’s the goal?
          </span>
          <select
            value={goal}
            onChange={(e) => onGoalChange(e.target.value as PosterGoal)}
            className={inputClass}
          >
            <option value="promote">Promote something</option>
            <option value="announce">Announce something</option>
            <option value="sell">Sell something</option>
            <option value="invite">Invite people</option>
            <option value="awareness">Build awareness</option>
            <option value="celebrate">Celebrate something</option>
          </select>
        </label>
      </section>

      {/* ── Main message ── */}
      <section className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Main message
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          What should this poster communicate?
        </p>
        <textarea
          value={mainMessage}
          onChange={(e) => onMainMessageChange(e.target.value)}
          rows={3}
          placeholder="e.g. Join us this Sunday for Night of Worship"
          className={inputClass}
        />
      </section>

      {/* ── Offer ── */}
      {showOffer && (
        <section className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Offer
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Optional badge or price — not a button.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Offer / discount
              </span>
              <input
                value={details.offer}
                onChange={(e) => onChange("offer", e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Price
              </span>
              <input
                value={details.price}
                onChange={(e) => onChange("price", e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </label>
          </div>
        </section>
      )}

      {/* ── Event / place ── */}
      {showEvent && (
        <section className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Event / place
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Service times, venues, locations.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Date
              </span>
              <input
                value={details.date}
                onChange={(e) => onChange("date", e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Time
              </span>
              <input
                value={details.time}
                onChange={(e) => onChange("time", e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Address
              </span>
              <input
                value={details.address}
                onChange={(e) => onChange("address", e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </label>
          </div>
        </section>
      )}

      {/* ── People ── */}
      {showPeople && (
        <section className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            People
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Photo + name + role (pastors, team, agents). Up to 4 people.
          </p>

          <div className="mt-4 space-y-4">
            {(people ?? []).map((person, index) => (
              <div
                key={person.id}
                className="rounded-xl border border-border/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-medium">Person {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => onRemovePerson?.(person.id)}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3">
                  <FilePicker
                    label="Photo"
                    hint="Portrait works best"
                    name={person.fileName}
                    onPick={(file) => onPersonPhoto?.(person.id, file)}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Name
                    </span>
                    <input
                      value={person.name}
                      onChange={(e) =>
                        onPersonChange?.(person.id, "name", e.target.value)
                      }
                      placeholder="e.g. Rev. Sarah Owusu"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Role
                    </span>
                    <input
                      value={person.role}
                      onChange={(e) =>
                        onPersonChange?.(person.id, "role", e.target.value)
                      }
                      placeholder="e.g. Lead Pastor"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onAddPerson?.()}
            disabled={(people ?? []).length >= 4}
            className="mt-4 w-full rounded-xl border border-dashed border-border/80 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {(people ?? []).length >= 4 ? "Maximum 4 people" : "+ Add person"}
          </button>
        </section>
      )}

      {/* ── Additional information ── */}
      <section className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Additional information
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Anything else to include (verse, features, “admission free”, etc.).
        </p>
        <textarea
          value={additionalInfo}
          onChange={(e) => onAdditionalInfoChange(e.target.value)}
          rows={3}
          placeholder="e.g. Free admission • Everyone is welcome"
          className={inputClass}
        />
      </section>

      {/* ── Contact ── */}
      <section className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Contact
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Usually small type at the bottom of the poster.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Phone
            </span>
            <input
              value={details.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="—"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Website
            </span>
            <input
              value={details.website}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder="—"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* ── Images ── */}
      <div className="mt-8 border-t border-border pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Brand & images
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Logo and a general main image. People photos are in the People
          section.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilePicker
            label="Logo"
            hint="PNG with transparency works best"
            name={logoName}
            onPick={onLogo}
          />
          <FilePicker
            label="Main image"
            hint="Product, property or scene"
            name={imageName}
            onPick={onImage}
          />
        </div>
      </div>
    </SpotlightCard>
  );
}

function FilePicker({
  label,
  hint,
  name,
  onPick,
}: {
  label: string;
  hint: string;
  name?: string | null;
  onPick: (file: File | null) => void;
}) {
  return (
    <label className="group cursor-pointer rounded-xl border border-dashed border-border/80 bg-background/40 p-4 transition-colors hover:border-foreground/40">
      <span className="text-[13px] font-medium tracking-tight text-foreground">
        {label}
      </span>
      <span className="mt-1 block text-[12px] text-muted-foreground">
        {name ?? hint}
      </span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground">
        {name ? "Replace" : "Choose file"}
      </span>
    </label>
  );
}

export default PosterDetailForm;