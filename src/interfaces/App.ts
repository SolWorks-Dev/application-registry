export default interface App {
    app: {
        value: string;
        label: string;
        categories: string[];
        is_curated: boolean;
    };
    urls: {
        logo: string;
        website: string;
        application: string;
        github: string;
        other: {
            name: string;
            url: string;
        }[];
    };
    description: {
        short: string;
        long: string;
    };
    socials: {
        twitter: string[];
        discord: string[];
        medium: string[];
        telegram: string[];
    };
}
