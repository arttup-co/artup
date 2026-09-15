import Link from "next/link";
import { AiOutlineTwitter, AiFillLinkedin, AiFillGithub } from "react-icons/ai";

interface FooterProps {
  emailContact?: string | null;
  websiteUrl?: string | null;
  location?: string | null;
  availability?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
}

export default function Footer({
  emailContact,
  websiteUrl,
  location,
  availability,
  githubUrl,
  twitterUrl,
  linkedinUrl,
}: FooterProps) {
  // Check if we have any contact info to display
  const hasContactInfo = emailContact || websiteUrl || location || availability;
  const hasSocialLinks = githubUrl || twitterUrl || linkedinUrl;

  if (!hasContactInfo && !hasSocialLinks) {
    // If no contact info, show minimal footer
    return (
      <footer className="border-t border-border bg-background">
        <div className="max-w-[960px] mx-auto px-6 lg:px-0 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              Made with{" "}
              <Link
                href="https://github.com/arttup-co/artup"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                Artup
              </Link>
            </p>
            <p>Open Source Blog</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-background">
      <div className="max-w-[960px] mx-auto px-6 lg:px-0 py-12">
        {/* Contacts Section */}
        {hasContactInfo && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Email */}
              {emailContact && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    Email
                  </h3>
                  <Link
                    href={`mailto:${emailContact}`}
                    className="text-lg hover:text-primary transition-colors underline decoration-1 underline-offset-4"
                  >
                    {emailContact}
                  </Link>
                </div>
              )}

              {/* Website */}
              {websiteUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    Website
                  </h3>
                  <Link
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:text-primary transition-colors underline decoration-1 underline-offset-4"
                  >
                    {websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </Link>
                </div>
              )}

              {/* Location & Availability */}
              {(location || availability) && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    {location && !availability ? "Location" : availability && !location ? "Availability" : "Info"}
                  </h3>
                  <div className="text-lg space-y-1">
                    {location && <p>{location}</p>}
                    {availability && <p className="text-muted-foreground">{availability}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <p>
              Made with{" "}
              <Link
                href="https://github.com/arttup-co/artup"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline decoration-1 underline-offset-2"
              >
                Artup
              </Link>
            </p>
            <span className="hidden sm:inline">•</span>
            <p>Open Source Blog</p>
          </div>

          {/* Social Icons */}
          {hasSocialLinks && (
            <div className="flex items-center gap-3">
              {twitterUrl && (
                <Link
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
                  aria-label="Twitter/X"
                >
                  <AiOutlineTwitter className="w-5 h-5" />
                </Link>
              )}
              {linkedinUrl && (
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
                  aria-label="LinkedIn"
                >
                  <AiFillLinkedin className="w-5 h-5" />
                </Link>
              )}
              {githubUrl && (
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
                  aria-label="GitHub"
                >
                  <AiFillGithub className="w-5 h-5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
