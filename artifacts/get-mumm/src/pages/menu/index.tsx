import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useListMenuItems, useListCategories } from "@workspace/api-client-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, X, SlidersHorizontal, Star, Clock, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 9;

const DIETARY_OPTIONS = [
  { value: "vegetarian", labelEn: "Vegetarian", labelAr: "نباتي" },
  { value: "vegan", labelEn: "Vegan", labelAr: "فيغان" },
  { value: "low_cal", labelEn: "Low Cal", labelAr: "قليل السعرات" },
  { value: "gluten_free", labelEn: "Gluten Free", labelAr: "خالي من الغلوتين" },
  { value: "halal", labelEn: "Halal", labelAr: "حلال" },
];

const PRICE_RANGES = [
  { labelEn: "Any price", labelAr: "أي سعر", max: null },
  { labelEn: "Under 50 EGP", labelAr: "أقل من 50 ج.م", max: 50 },
  { labelEn: "Under 80 EGP", labelAr: "أقل من 80 ج.م", max: 80 },
  { labelEn: "Under 120 EGP", labelAr: "أقل من 120 ج.م", max: 120 },
];

export default function MenuPage() {
  const { t, isRtl } = useLanguage();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeDietary, setActiveDietary] = useState<string[]>([]);
  const [priceRangeIdx, setPriceRangeIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [activeCategory, activeDietary, priceRangeIdx, debouncedSearch]);

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories();
  const { data: allItems, isLoading: isItemsLoading } = useListMenuItems({
    categoryId: activeCategory ?? undefined,
    search: debouncedSearch || undefined,
    maxPrice: PRICE_RANGES[priceRangeIdx].max ?? undefined,
  });

  // Client-side dietary filter (API doesn't have it as a param)
  const items = useMemo(() => {
    if (!allItems) return [];
    if (activeDietary.length === 0) return allItems;
    return allItems.filter((item) =>
      activeDietary.every((d) => item.dietary.includes(d))
    );
  }, [allItems, activeDietary]);

  const totalPages = Math.ceil((items?.length ?? 0) / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(
    () => items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [items, currentPage]
  );

  const activeFilterCount =
    (activeCategory !== null ? 1 : 0) +
    activeDietary.length +
    (priceRangeIdx > 0 ? 1 : 0) +
    (debouncedSearch ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveCategory(null);
    setActiveDietary([]);
    setPriceRangeIdx(0);
    setCurrentPage(1);
  };

  const toggleDietary = (val: string) => {
    setActiveDietary((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="bg-primary/8 pt-28 sm:pt-32 pb-10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
              {t("Our Menu", "قائمة الطعام")}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              {t(
                "Fresh, homemade meals from our talented chefs — delivered to your door.",
                "وجبات طازجة ومنزلية من أمهر طهاتنا، تصلك حتى بابك."
              )}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none ${
                isRtl ? "right-4" : "left-4"
              }`}
            />
            <Input
              placeholder={t("Search dishes, chefs...", "ابحث عن طبق أو شيف...")}
              className={`h-12 rounded-full bg-background shadow-sm border-border text-sm ${
                isRtl ? "pr-11 pl-11" : "pl-11 pr-11"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-menu-search"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${
                  isRtl ? "left-4" : "right-4"
                }`}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">

        {/* ── Category Tabs (horizontal scroll, visible on all screens) ── */}
        <div
          ref={categoryScrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6"
          data-testid="filter-categories"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              activeCategory === null
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
            }`}
            data-testid="filter-category-all"
          >
            {t("All", "الكل")}
          </button>
          {isCategoriesLoading
            ? Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />
              ))
            : categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                  }`}
                  data-testid={`filter-category-${cat.id}`}
                >
                  {isRtl ? cat.nameAr : cat.name}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal ${
                    activeCategory === cat.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {cat.itemCount}
                  </span>
                </button>
              ))}
        </div>

        {/* ── Advanced Filters Row ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {/* Filter toggle button (mobile-friendly) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              filtersOpen || activeDietary.length > 0 || priceRangeIdx > 0
                ? "bg-primary/10 border-primary text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
            }`}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("Filters", "تصفية")}
            {(activeDietary.length > 0 || priceRangeIdx > 0) && (
              <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeDietary.length + (priceRangeIdx > 0 ? 1 : 0)}
              </span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Price range pills */}
          {PRICE_RANGES.slice(1).map((range, i) => (
            <button
              key={i}
              onClick={() => setPriceRangeIdx(priceRangeIdx === i + 1 ? 0 : i + 1)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                priceRangeIdx === i + 1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground bg-background"
              }`}
              data-testid={`filter-price-${i + 1}`}
            >
              {isRtl ? range.labelAr : range.labelEn}
            </button>
          ))}

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium border border-dashed border-destructive/50 text-destructive hover:bg-destructive/8 transition-colors ml-auto"
              data-testid="button-clear-filters"
            >
              <X className="h-3.5 w-3.5" />
              {t(`Clear all (${activeFilterCount})`, `مسح الكل (${activeFilterCount})`)}
            </button>
          )}
        </div>

        {/* ── Dietary Filter Panel ── */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/40 border border-border rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  {t("Dietary Preference", "التفضيل الغذائي")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleDietary(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        activeDietary.includes(opt.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-foreground bg-background"
                      }`}
                      data-testid={`filter-dietary-${opt.value}`}
                    >
                      {isRtl ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Count + Sort ── */}
        <div className="flex items-center justify-between mb-5 min-h-[28px]">
          <div className="text-sm text-muted-foreground" data-testid="text-results-count">
            {isItemsLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <>
                <span className="font-semibold text-foreground">{items.length}</span>{" "}
                {t("dishes found", "طبق متاح")}
                {activeFilterCount > 0 && (
                  <span className="text-primary font-medium">
                    {" "}{t("(filtered)", "(بعد التصفية)")}
                  </span>
                )}
              </>
            )}
          </div>
          {totalPages > 1 && (
            <p className="text-xs text-muted-foreground">
              {t(`Page ${currentPage} of ${totalPages}`, `صفحة ${currentPage} من ${totalPages}`)}
            </p>
          )}
        </div>

        {/* ── Items Grid ── */}
        {isItemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">{t("No dishes found", "لم يتم العثور على أطباق")}</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              {t("Try adjusting your search or filters.", "جرب تغيير كلمة البحث أو التصفية.")}
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors"
            >
              {t("Clear Filters", "مسح التصفية")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedItems.map((item) => (
                <Link key={item.id} href={`/menu/${item.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                    data-testid={`card-menu-item-${item.id}`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={isRtl ? item.nameAr : item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {item.isFeatured && (
                        <span className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow`}>
                          {t("Popular", "الأكثر طلباً")}
                        </span>
                      )}
                      {item.dietary.includes("vegetarian") && (
                        <span className={`absolute top-3 ${isRtl ? "left-3" : "right-3"} bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                          {t("Veg", "نباتي")}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-base leading-snug">
                          {isRtl ? item.nameAr : item.name}
                        </h3>
                        <span className="font-bold text-primary whitespace-nowrap text-sm shrink-0">
                          {item.price} {t("EGP", "ج.م")}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">
                        {isRtl ? item.descriptionAr : item.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {isRtl ? item.chefNameAr : item.chefName}
                        </span>
                        <div className="flex items-center gap-3">
                          {item.rating && (
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              {item.rating}
                            </span>
                          )}
                          {item.prepTimeMinutes && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              {item.prepTimeMinutes}{t("m", "د")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isRtl={isRtl}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
