// /src/components/Header.tsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Container } from "./ui/Container";
import { useAuth } from "../contexts/AuthContext";
import ColonaiveLogo from "./ColonaiveLogo";
import { getDashboardRoute } from "./ProtectedRoute";
import CountrySelector from "./CountrySelector";

/** ---------- Types ---------- */
type NavLink = {
  label: string;
  path: string;
  isHeader?: boolean; // section header/divider if true
};

/** ---------- Link Data ---------- */
const educationLinks: NavLink[] = [
  { label: "Education Hub", path: "/education" },
  { label: "Patient Education", path: "/education/patients" },
  { label: "Clinician Education", path: "/education/clinicians" },
  { label: "FAQs", path: "/education/faqs" },
  { label: "📰 Live CRC News", path: "/news" },
  { label: "Resources", path: "/education/resources" },
  { label: "Upcoming Events", path: "/upcoming-events" },
];

const screeningLinks: NavLink[] = [
  { label: "Colonoscopy (Gold Standard)", path: "/education/article/colonoscopy-gold-standard" },
  { label: "Screening Blood Test", path: "/get-screened" },
  { label: "Find a Screening Center", path: "/find-a-gp" },
  { label: "Find a COLONAiVE Specialist", path: "/find-a-specialist" },
  { label: "---------", path: "#", isHeader: true },
  { label: "🌏 Explore by Country", path: "/seo", isHeader: true },
  { label: "🇸🇬 Singapore", path: "/seo/singapore-colorectal-screening" },
  { label: "🇦🇺 Australia", path: "/seo/australia-bowel-cancer-screening" },
  { label: "🇮🇳 India", path: "/seo/colorectal-cancer-screening-india" },
  { label: "🇵🇭 Philippines", path: "/seo/colorectal-cancer-screening-philippines" },
  { label: "🇯🇵 Japan", path: "/seo/colorectal-cancer-screening-japan" },
];

const pillarLinks: NavLink[] = [
  { label: "All Pillars Overview", path: "/movement-pillars" },
  { label: "RID-CRC PUB™", path: "/pillars/rid-crc-pub" },
  { label: "RID-CRC SGP™", path: "/pillars/rid-crc-sgp" },
  { label: "RID-CRC GOV™", path: "/pillars/rid-crc-gov" },
  { label: "RID-CRC CSR™", path: "/pillars/rid-crc-csr" },
  { label: "RID-CRC EDU™", path: "/pillars/rid-crc-edu" },
];

const aboutLinks: NavLink[] = [
  { label: "Our Story", path: "/about-us" },
  { label: "Our Advisors", path: "/about/advisors" },
  { label: "Vision 2035", path: "/vision2035" },
  { label: "CSR Showcase", path: "/csr-showcase" },
  { label: "Contact Us", path: "/contact" },
];

export const getJoinLinks = (isAuthenticated: boolean): NavLink[] =>
  isAuthenticated
    ? [
        { label: "Share Your Story", path: "/share-your-story" },
        { label: "Read Real Stories", path: "/stories" },
        { label: "Refer a Friend", path: "/refer-friend" },
      ]
    : [
        { label: "Member/Patient Sign-Up", path: "/signup/champion" },
        { label: "Clinic Sign-Up", path: "/register/clinic" },
        { label: "Sponsor/CSR Sign-Up", path: "/register/corporate" },
        { label: "Read Real Stories", path: "/stories" },
      ];

/** Small helper to pretty-print the account type */
function prettyUserType(userType?: string | null) {
  switch (userType) {
    case "super_admin":
      return "Super Admin Account";
    case "admin":
      return "Admin Account";
    case "gpclinic":
      return "GP Clinic Account";
    case "specialist":
      return "Specialist Account";
    case "corporate_contact":
      return "Corporate Account";
    case "champion":
      return "Member Account";
    default:
      return "Account";
  }
}

/** ---------- Component ---------- */
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isTrialsHovered, setIsTrialsHovered] = useState(false);
  const [isNewsHovered, setIsNewsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const menuLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated, signOut, userType } = useAuth();

  const isAdmin = userType === "super_admin" || userType === "admin";
  const joinLinks = getJoinLinks(isAuthenticated);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleMenuEnter = (menuKey: string) => {
    if (menuLeaveTimeout.current) clearTimeout(menuLeaveTimeout.current);
    setActiveSubmenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuLeaveTimeout.current = setTimeout(() => setActiveSubmenu(null), 200);
  };

  const handleSignOut = async () => {
    try {
      const { success, error } = await signOut();
      if (success) {
        handleClose();
        navigate("/");
      } else {
        console.error("Sign out error:", error);
        alert(`Failed to sign out: ${error}`);
      }
    } catch (err) {
      console.error("Sign out exception:", err);
      alert("An unexpected error occurred during sign out.");
    }
  };

  const renderDropdown = (label: string, links: NavLink[], menuKey: string) => (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => handleMenuEnter(menuKey)}
      onMouseLeave={handleMenuLeave}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white hover:text-teal-300">
        {label}
        <ChevronDown
          className={`w-3 h-3 text-white transition-transform ${
            activeSubmenu === menuKey ? "rotate-180" : ""
          }`}
        />
      </button>
      <span
        className={`absolute bottom-[20px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform transition-transform duration-300 ease-out origin-center ${
          activeSubmenu === menuKey ? "scale-x-100" : "scale-x-0"
        }`}
      />
      {activeSubmenu === menuKey && (
        <div className="absolute top-full left-0 w-60 mt-0 rounded-b-lg bg-[#0b1e3b] shadow-lg ring-1 ring-white/10 z-[9999]">
          <ul className="py-2">
            {links.map((link, index) => (
              <li key={`${link.path}-${index}`}>
                {link.isHeader ? (
                  link.label.startsWith("---------") ? (
                    <div className="px-4 py-1">
                      <div className="border-t border-white/20" />
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
                      {link.label}
                    </div>
                  )
                ) : (
                  <Link
                    to={link.path}
                    className="group relative block w-full px-4 py-2 text-sm text-white hover:text-teal-300 transition-colors duration-300 text-left"
                    onClick={handleClose}
                  >
                    <span className="relative inline-block">
                      {link.label}
                      <span className="absolute bottom-[-2px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSearchBar = () => (
    <div className="border-t border-white/10 py-3 bg-[#0B1E3B]">
      <Container>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Explore topics, care, coverage"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2 pr-10 text-sm rounded-full border border-white/20 bg-white/5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </Container>
    </div>
  );

  const renderChampionButton = () => {
    if (isAuthenticated && user) {
      const userName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

      // Default dashboard based on user type
      let dashboardPath = getDashboardRoute(userType);
      // Admin override
      if (isAdmin) dashboardPath = "/admin/dashboard";

      // Default profile-settings paths (none for Admin)
      let profileSettingsPath: string | undefined = "/profile/champion";
      if (userType === "gpclinic") profileSettingsPath = "/profile/gp-clinic";
      else if (userType === "specialist") profileSettingsPath = "/profile/specialist";
      else if (userType === "corporate_contact") profileSettingsPath = "/dashboard/corporate";
      else if (isAdmin) profileSettingsPath = undefined; // hide for super admin

      return (
        <div
          key={user.id}
          className="relative"
          onMouseEnter={() => handleMenuEnter("userMenu")}
          onMouseLeave={handleMenuLeave}
        >
          <button
            type="button"
            className="bg-[#006BA6] hover:bg-[#005C8D] text-white rounded-full px-4 py-2 text-sm shadow-md flex items-center space-x-2"
          >
            <span>{userName?.split(" ")[0] || "User"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                activeSubmenu === "userMenu" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeSubmenu === "userMenu" && (
            <div className="absolute top-full right-0 w-56 mt-2 rounded-lg bg-white shadow-xl ring-1 ring-black/5 z-[9999]">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={userName}>
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">{prettyUserType(userType)}</p>
                </div>

                {/* Dashboard (admin goes to /admin/dashboard) */}
                <Link
                  to={dashboardPath}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleClose}
                >
                  My Dashboard
                </Link>

                {/* Super Admin quick actions */}
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/partner-specialists/new"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleClose}
                    >
                      Add Partner Specialist
                    </Link>
                    <Link
                      to="/admin/csr/new"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleClose}
                    >
                      Add Corporate Champion
                    </Link>
                    <Link
                      to="/csr-showcase"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleClose}
                    >
                      View CSR Showcase
                    </Link>
                  </>
                ) : (
                  // Non-admin users: show profile settings
                  profileSettingsPath && (
                    <Link
                      to={profileSettingsPath}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleClose}
                    >
                      Profile Settings
                    </Link>
                  )
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Not authenticated
    return (
      <Link to="/login" onClick={handleClose}>
        <button
          type="button"
          className="bg-[#006BA6] hover:bg-[#005C8D] text-white rounded-full px-5 py-2 text-sm shadow-md"
        >
          Champion Sign In
        </button>
      </Link>
    );
  };

  const renderMobileMenu = () => {
    const groups: { label: string; links: NavLink[]; key: string }[] = [
      { label: "Education", links: educationLinks, key: "edu" },
      { label: "Get Screened", links: screeningLinks, key: "screen" },
      { label: "Movement Pillars", links: pillarLinks, key: "pillars" },
      { label: "Join the Movement", links: getJoinLinks(isAuthenticated), key: "join" },
      { label: "About Us", links: aboutLinks, key: "about" },
    ];

    return (
      <div className="absolute top-full left-0 w-full bg-[#0B1E3B] lg:hidden z-[60]">
        <nav className="flex flex-col space-y-2 p-4">
          {groups.map((item) => (
            <div key={item.key} className="text-white">
              <button
                onClick={() => setActiveSubmenu(activeSubmenu === item.key ? null : item.key)}
                className="w-full flex justify-between items-center py-2 font-semibold"
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeSubmenu === item.key ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeSubmenu === item.key && (
                <ul className="pl-4 border-l-2 border-teal-400/50">
                  {item.links.map((link, linkIndex) => (
                    <li key={`${link.path}-${linkIndex}`}>
                      {link.isHeader ? (
                        link.label.startsWith("---------") ? (
                          <div className="py-1">
                            <div className="border-t border-white/20" />
                          </div>
                        ) : (
                          <div className="py-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
                            {link.label}
                          </div>
                        )
                      ) : (
                        <Link to={link.path} onClick={handleClose} className="block py-2 text-sm hover:text-teal-300">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <Link to="/news" onClick={handleClose} className="text-white font-semibold py-2 flex items-center">
            📰 Live CRC News
            <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
          </Link>
          <Link to="/clinical-trials" onClick={handleClose} className="text-white font-semibold py-2">
            Clinical Trials
          </Link>
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Top slim bar (country + auth) - sticky and above everything */}
      <header ref={headerRef} className="sticky top-0 z-50 bg-[#004F8C] shadow-sm">
        <div className="py-1">
          <Container className="flex justify-between items-center h-10">
            <CountrySelector className="mr-auto" />
            {renderChampionButton()}
          </Container>
        </div>

        {/* Main nav bar */}
        <div className="bg-[#0B1E3B]">
          <Container className="flex justify-between items-center h-[72px]">
            <div className="flex-1 flex justify-start">
              <Link
                to="/"
                className="group relative transition-transform duration-300 hover:-translate-y-0.5"
                onClick={handleClose}
              >
                <ColonaiveLogo
                  className="text-2xl text-white"
                  accentColorClass="text-teal-400 group-hover:text-teal-300 transition-colors duration-300"
                />
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center" />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center justify-center flex-shrink-0 h-full">
              {renderDropdown("Education", educationLinks, "edu")}
              {renderDropdown("Get Screened", screeningLinks, "screen")}
              {renderDropdown("Movement Pillars", pillarLinks, "pillars")}

              <Link
                to="/news"
                className="relative text-white hover:text-teal-300 flex items-center text-sm font-semibold px-3 h-full"
                title="Daily updated CRC headlines + summaries from trusted medical sources."
                onMouseEnter={() => setIsNewsHovered(true)}
                onMouseLeave={() => setIsNewsHovered(false)}
              >
                📰 Live CRC News
                <span className="ml-1 w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                <span
                  className={`absolute bottom-[20px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform transition-transform duration-300 ease-out origin-center ${
                    isNewsHovered ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>

              {renderDropdown("Join the Movement", joinLinks, "join")}
              {renderDropdown("About Us", aboutLinks, "about")}

              <Link
                to="/clinical-trials"
                className="relative text-white text-sm font-semibold px-3 h-full flex items-center hover:text-teal-300"
                onMouseEnter={() => setIsTrialsHovered(true)}
                onMouseLeave={() => setIsTrialsHovered(false)}
              >
                Clinical Trials
                <span
                  className={`absolute bottom-[20px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform transition-transform duration-300 ease-out origin-center ${
                    isTrialsHovered ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </nav>

            <div className="flex-1 flex justify-end lg:hidden">
              <button className="p-2 text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </Container>

          {isOpen && renderMobileMenu()}
          {renderSearchBar()}
        </div>
      </header>
    </>
  );
};
