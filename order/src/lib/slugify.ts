import slugify from "slugify";

class SlugifyServiceClass {
  private readonly options = {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    trim: true,
    locale: "en",
  };

  generateSlug(text: string): string {
    if (!text) return "";
    return slugify(text, this.options);
  }
}

export const SlugifyService = new SlugifyServiceClass();
