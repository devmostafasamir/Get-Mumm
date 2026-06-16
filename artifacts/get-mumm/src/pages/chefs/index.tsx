import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useListChefs } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Search, X, UtensilsCrossed } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChefsPage() {
  const { t, isRtl } = useLanguage();
  const { data: chefs, isLoading } = useListChefs();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Collect all unique specialties from the data
  const allSpecialties = useMemo(() => {
    if (!chefs) return [];
    const set = new Set<string>();
    chefs.forEach((chef) => {
      (isRtl ? chef.specialtiesAr : chef.specialties).forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [chefs, isRtl]);

  const filteredChefs = useMemo(() => {
    if (!chefs) return [];
    let result = chefs;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameAr.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (activeSpecialty) {
      result = result.filter((c) =>
        (isRtl ? c.specialtiesAr : c.specialties).includes(activeSpecialty)
      );
    }
    return result;
  }, [chefs, debouncedSearch, activeSpecialty, isRtl]);

  const clearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveSpecialty(null);
  };

  const hasFilters = !!debouncedSearch || !!activeSpecialty;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-primary/8 pt-28 sm:pt-32 pb-10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
            {t("Meet Our Chefs", "تعرف على طهاتنا")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm sm:text-base">
            {t(
              "Talented women crafting authentic meals from their homes to yours. Every dish has a story.",
              "نساء موهوبات يجهزن وجبات أصيلة من منازلهن إليكم. كل طبق له قصة."
            )}
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none ${
                isRtl ? "right-4" : "left-4"
              }`}
            />
            <input
              type="text"
              placeholder={t("Search chefs or specialties...", "ابحث عن شيف أو تخصص...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full h-11 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm ${
                isRtl ? "pr-11 pl-10 text-right" : "pl-11 pr-10"
              }`}
              data-testid="input-chefs-search"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
                  isRtl ? "left-4" : "right-4"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10">

        {/* Specialty filter chips (horizontal scroll) */}
        {!isLoading && allSpecialties.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6" data-testid="filter-specialties">
            <button
              onClick={() => setActiveSpecialty(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeSpecialty === null
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
              }`}
              data-testid="filter-specialty-all"
            >
              {t("All Specialties", "كل التخصصات")}
            </button>
            {allSpecialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setActiveSpecialty(activeSpecialty === spec ? null : spec)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeSpecialty === spec
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                }`}
                data-testid={`filter-specialty-${spec}`}
              >
                {spec}
              </button>
            ))}
          </div>
        )}

        {/* Results row */}
        <div className="flex items-center justify-between mb-6 min-h-[24px]">
          <div className="text-sm text-muted-foreground" data-testid="text-chefs-count">
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <>
                <span className="font-semibold text-foreground">{filteredChefs.length}</span>{" "}
                {t("chefs", "شيف")}
              </>
            )}
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors font-medium"
              data-testid="button-clear-chefs-filters"
            >
              <X className="h-3.5 w-3.5" />
              {t("Clear filters", "مسح التصفية")}
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[480px] w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredChefs.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("No chefs found", "لم يتم العثور على شيف")}</h3>
            <p className="text-muted-foreground text-sm mb-5">
              {t("Try a different search or specialty.", "جرب بحثاً أو تخصصاً مختلفاً.")}
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors"
            >
              {t("Show All Chefs", "عرض كل الطهاة")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChefs.map((chef) => (
              <motion.div
                key={chef.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                data-testid={`card-chef-${chef.id}`}
              >
                {/* Photo */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
                  <img
                    src={chef.imageUrl}
                    alt={isRtl ? chef.nameAr : chef.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1.5 rounded-full shadow">
                    <Star className="h-3 w-3 fill-current" />
                    {chef.rating}
                  </div>
                  {/* Since year */}
                  <div className="absolute bottom-3 left-3 bg-background/85 backdrop-blur-sm text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {t(`Since ${chef.joinedYear}`, `منذ ${chef.joinedYear}`)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-serif font-bold">{isRtl ? chef.nameAr : chef.name}</h3>
                    <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
                      {chef.itemCount} {t("dishes", "طبق")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {isRtl ? chef.bioAr : chef.bio}
                  </p>

                  {/* Specialties */}
                  <div className="border-t border-border pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      {t("Specialties", "التخصصات")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(isRtl ? chef.specialtiesAr : chef.specialties).map((spec, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            const enSpec = chef.specialties[i];
                            const arSpec = chef.specialtiesAr[i];
                            const target = isRtl ? arSpec : enSpec;
                            setActiveSpecialty(activeSpecialty === target ? null : target);
                          }}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                            (isRtl ? chef.specialtiesAr : chef.specialties).indexOf(spec) !== -1 &&
                            activeSpecialty === spec
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                          data-testid={`specialty-chip-${i}`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
