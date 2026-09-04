"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react";

import { useCustomer } from "@/context/CustomerContext";
import { useCategories } from "@/context/CategoriesContext";
import { useCollections } from "@/context/CollectionsContext";
import SearchDropdownLoader from "../SearchDropdownLoader";

import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import { getSlug, getItemImage, getNavbarImagesForItems } from "./navbarUtils";
import { fetchSearchSuggestions } from "@/api/search/search";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTyping, setSearchTyping] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const searchRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const { customer, cartCount, wishlistCount } = useCustomer();
  const { categories = [] } = useCategories();
  const { collections = [] } = useCollections();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setSearchFocused(false);
  }, [pathname]);

  useEffect(() => {
    const query = searchTerm.trim();

    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      setSearchTyping(false);
      return;
    }

    setSearchTyping(true);

    let active = true;

    const timer = setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(query);

        if (active) {
          setSearchSuggestions(Array.isArray(results) ? results : []);
        }
      } catch (error) {
        console.error("Search suggestion failed:", error);

        if (active) {
          setSearchSuggestions([]);
        }
      } finally {
        if (active) {
          setSearchTyping(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pureSilverCollection = useMemo(() => {
    return collections.find((item) => {
      const name = item?.name?.toLowerCase();
      const slug = item?.slug?.toLowerCase();
      return name === "pure silver" || slug === "pure-silver";
    });
  }, [collections]);

  const allCollections = useMemo(() => {
    return collections.filter(
      (item) => item?.slug?.toLowerCase() !== "pure-silver",
    );
  }, [collections]);

  const featuredCollections = useMemo(() => {
    return allCollections.slice(0, 6);
  }, [allCollections]);

  const featuredCategories = useMemo(() => {
    return categories.slice(0, 8);
  }, [categories]);

  const shopDropdown = useMemo(() => {
    return [
      {
        heading: "Shop by Category",
        items: featuredCategories.map((category) => ({
          title: category.name,
          subtitle: category.description || "Explore premium silver pieces",
          href: `/shop?category=${getSlug(category)}`,
          image: getItemImage(category),
        })),
      },
      {
        heading: "Shop by Collection",
        items: featuredCollections.map((collection) => ({
          title: collection.name,
          subtitle: collection.description || "Curated Elmas collection",
          href: `/shop?collection=${getSlug(collection)}`,
          image: getItemImage(collection),
        })),
      },
    ];
  }, [featuredCategories, featuredCollections]);

  const collectionsDropdown = useMemo(() => {
    return featuredCollections.map((collection) => ({
      title: collection.name,
      subtitle: collection.description || "Discover curated silver luxury",
      href: `/shop?collection=${getSlug(collection)}`,
      image: getItemImage(collection),
    }));
  }, [featuredCollections]);

  const mobileCollectionsDropdown = useMemo(() => {
    return allCollections.map((collection) => ({
      title: collection.name,
      subtitle: collection.description || "Discover curated silver luxury",
      href: `/shop?collection=${getSlug(collection)}`,
      image: getItemImage(collection),
    }));
  }, [allCollections]);

  const mobileShopDropdown = useMemo(() => {
    return [
      {
        heading: "Shop by Category",
        items: featuredCategories.map((category) => ({
          title: category.name,
          subtitle: category.description || "Explore premium silver pieces",
          href: `/shop?category=${getSlug(category)}`,
          image: getItemImage(category),
        })),
      },
      {
        heading: "Shop by Collection",
        items: allCollections.map((collection) => ({
          title: collection.name,
          subtitle: collection.description || "Curated Elmas collection",
          href: `/shop?collection=${getSlug(collection)}`,
          image: getItemImage(collection),
        })),
      },
    ];
  }, [featuredCategories, allCollections]);

  const menuItems = useMemo(
    () => [
      {
        title: "Shop",
        href: "/shop",
        badge: "EXPLORE ELMAS",
        description:
          "Discover pure silver idols, purses, antiques, religious gifts and handcrafted luxury pieces.",
        type: "shop",
        dropdown: shopDropdown,
      },
      {
        title: "Collections",
        href: "/shop",
        badge: "CURATED EDITS",
        description:
          "Explore handpicked collections crafted for gifting, devotion, celebration and premium living.",
        type: "collections",
        dropdown: collectionsDropdown,
      },
      // {
      //   title: "Pure Silver",
      //   href: pureSilverCollection
      //     ? `/shop?collection=${getSlug(pureSilverCollection)}`
      //     : "/shop?collection=pure-silver",
      //   dropdown: null,
      // },
      {
        title: "Contact",
        href: "/contact",
        dropdown: null,
      },
      {
        title: "The Elmas",
        href: "/about",
        dropdown: null,
      },
    ],
    [shopDropdown, collectionsDropdown, pureSilverCollection],
  );

  const mobileMenuItems = useMemo(
    () => [
      {
        title: "Shop",
        href: "/shop",
        badge: "EXPLORE ELMAS",
        type: "shop",
        dropdown: mobileShopDropdown,
      },
      {
        title: "Collections",
        href: "/shop",
        badge: "CURATED EDITS",
        type: "collections",
        dropdown: mobileCollectionsDropdown,
      },
      {
        title: "Contact",
        href: "/contact",
        dropdown: null,
      },
      {
        title: "The Elmas",
        href: "/about",
        dropdown: null,
      },
    ],
    [mobileShopDropdown, mobileCollectionsDropdown],
  );

  const activeMenuData = menuItems.find((item) => item.title === activeMenu);

  const menuImages = useMemo(() => {
    if (activeMenuData?.type === "collections") {
      return getNavbarImagesForItems({
        items: featuredCollections,
        type: "collection",
        limit: 3,
      });
    }

    if (activeMenuData?.type === "shop") {
      return getNavbarImagesForItems({
        items: featuredCategories,
        type: "category",
        limit: 3,
      });
    }

    return [];
  }, [activeMenuData, featuredCategories, featuredCollections]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();
    if (!query) return;

    setSearchFocused(false);
    router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  const closeSearch = () => {
    setSearchFocused(false);
    setSearchTerm("");
    setSearchSuggestions([]);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="relative bg-forest-700 px-4 py-2">
          <form
            ref={searchRef}
            onSubmit={handleSearchSubmit}
            className="relative mx-auto max-w-2xl"
          >
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-100/70"
            />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search Ganesh Ji, silver idols, purses, collections..."
              className="w-full rounded-full border border-cream-100/20 bg-white/10 px-10 py-2 text-sm text-cream-100 placeholder:text-cream-100/60 outline-none backdrop-blur-md transition-all focus:border-cream-100/40 focus:bg-white/15"
            />

            {searchFocused && searchTerm.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[90] overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-2xl">
                {searchTyping ? (
                  <SearchDropdownLoader />
                ) : searchSuggestions.length > 0 ? (
                  <>
                    <div className="search-scrollbar max-h-[360px] overflow-y-auto">
                      {searchSuggestions.map((item, index) => (
                        <Link
                          key={`${item.type}-${item.href}-${index}`}
                          href={item.href}
                          onClick={closeSearch}
                          className="group flex items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-b-0 hover:bg-cream-100"
                        >
                          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-cream-100">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title || "Search result"}
                                width={44}
                                height={44}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-forest-700">
                                <Search size={16} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-luxury text-base text-forest-800">
                              {item.title}
                            </p>
                            <p className="truncate font-sans text-[10px] uppercase tracking-[0.18em] text-forest-500">
                              {item.subtitle}
                            </p>
                          </div>

                          <span className="rounded-full bg-forest-700/10 px-3 py-1 font-sans text-[9px] uppercase tracking-widest text-forest-700">
                            {item.type}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full border-t border-cream-200 bg-forest-700 px-4 py-3 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-cream-100 transition-colors hover:bg-forest-800"
                    >
                      View all results for “{searchTerm}”
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="w-full px-4 py-4 text-left hover:bg-cream-100"
                  >
                    <p className="font-luxury text-base text-forest-800">
                      Search for “{searchTerm}”
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-forest-500">
                      View all products matching this search
                    </p>
                  </button>
                )}
              </div>
            )}
          </form>
        </div>

        <div
          className={`relative transition-all duration-300 ${
            scrolled ? "bg-white" : "bg-cream-100"
          }`}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="mx-auto flex h-[82px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
            <Link href="/" className="relative z-10 flex-shrink-0 md:mt-1">
              <Image
                src="/logo.png"
                alt="Elmas by Abhinandan"
                width={140}
                height={52}
                className="object-contain drop-shadow-sm"
              />
            </Link>

            <div className="hidden items-center gap-0 lg:flex">
              <Link
                href="/"
                className="flex items-center px-4 py-[30px] font-sans text-[11px] uppercase tracking-[0.15em] text-forest-800 transition-colors hover:text-forest-500"
              >
                Home
              </Link>

              {menuItems.map((item) => (
                <div
                  key={item.title}
                  onMouseEnter={() =>
                    item.dropdown
                      ? setActiveMenu(item.title)
                      : setActiveMenu(null)
                  }
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-[30px] font-sans text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-forest-500 ${
                      activeMenu === item.title
                        ? "text-forest-600"
                        : "text-forest-800"
                    }`}
                  >
                    {item.title}
                    {item.dropdown && (
                      <ChevronDown
                        size={9}
                        className={`transition-transform duration-200 ${
                          activeMenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {item.dropdown && activeMenu === item.title && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-1 -translate-x-1/2 bg-forest-700" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/wishlist"
                className="relative hidden text-forest-800 transition-colors hover:text-forest-500 sm:flex"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-forest-700 text-[9px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative flex text-forest-800 transition-colors hover:text-forest-500"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-forest-700 text-[9px] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href={customer ? "/account/profile" : "/auth/login"}
                className="hidden text-forest-800 transition-colors hover:text-forest-500 sm:flex"
              >
                <User size={18} />
              </Link>

              <button
                type="button"
                className="text-forest-800 lg:hidden"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <MegaMenu
            activeMenuData={activeMenuData}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            menuImages={menuImages}
          />

          <MobileMenu
            mobileOpen={mobileOpen}
            mobileExpanded={mobileExpanded}
            setMobileExpanded={setMobileExpanded}
            menuItems={mobileMenuItems}
            user={customer}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            setMobileOpen={setMobileOpen}
          />
        </div>
      </div>

      <div className="h-[132px]" />
    </>
  );
}
