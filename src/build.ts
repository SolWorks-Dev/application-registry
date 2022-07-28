import App from "./interfaces/App";
import Category from "./interfaces/Category";
const path = require('path');
const toml = require('toml');
const { promises: { readdir, readFile, writeFile } } = require('fs');
const directoryPath = path.join(__dirname);

class DataBuilder {
    private _data: {
        apps: App[];
        categories: Category[];
    };

    private constructor() {
        this._data = {
            apps: [],
            categories: []
        };
    }

    public static create() {
        return new DataBuilder();
    }

    public async build() {
        // Load apps
        const apps = await this.loadAllApps();

        // Load categories
        const categories = await this.loadAllCategories();

        // validate app data
        for (const app of apps) {
            const category = categories.find((category: Category) => category.value === app.app.categories[0]);
            if (!category) {
                throw new Error(`Category ${app.app.categories[0]} is not a valid category`);
            }

            if (!app.app.value || !app.app.value.trim()) {
                throw new Error(`App value ${app.app.label} has no value`);
            }

            if (!app.app.label || !app.app.label.trim()) {
                throw new Error(`App ${app.app.value} has no label`);
            }

            if (app.app.categories.length === 0) {
                throw new Error(`App ${app.app.label} has no categories`);
            }

            if (!app.description.short || !app.description.short.trim()) {
                throw new Error(`App ${app.app.value} has no short description`);
            }

            if (!app.description.long || !app.description.long.trim()) {
                throw new Error(`App ${app.app.value} has no long description`);
            }

            if (!app.urls.logo || !app.urls.logo.trim()) {
                throw new Error(`App ${app.app.value} has no logo url`);
            }

            if (!app.urls.website || !app.urls.website.trim()) {
                throw new Error(`App ${app.app.value} has no website url`);
            }

            if (!app.urls.application || !app.urls.application.trim()) {
                throw new Error(`App ${app.app.value} has no application url`);
            }

            if (app.socials.twitter) {
                if (app.socials.twitter.includes('twitter' || app.socials.twitter.includes('@'))) {
                    throw new Error(`App ${app.app.value} has an invalid twitter handle`);
                }
            }

            if (app.socials.discord) {
                if (app.socials.discord.includes('discord.gg')) {
                    throw new Error(`App ${app.app.value} has an invalid discord invite`);
                }
            }

            if (app.socials.telegram) {
                if (app.socials.telegram.includes('t.me')) {
                    throw new Error(`App ${app.app.value} has an invalid telegram invite`);
                }
            }

            if (app.urls.github !== "" && !app.urls.github.includes('github')) {
                throw new Error(`App ${app.app.value} has an invalid github link`);
            }
        }

        // Validate category data
        for (const category of categories) {
            // Validate heading
            if (!category.heading_label || !category.heading_label.trim()) {
                throw new Error(`Category ${category.value} has no heading label`);
            }

            // Validate tag
            if (!category.tag_label || !category.tag_label.trim()) {
                throw new Error(`Category ${category.value} has no tag label`);
            }

            // Validate value
            if (!category.value || !category.value.trim()) {
                throw new Error(`Category ${category.tag_label} has no value`);
            }
        }

        this._data.apps = apps;
        this._data.categories = categories;

        return this;
    }

    public async save() {
        await writeFile(directoryPath + '/app-list.json', JSON.stringify(this._data));
        return this;
    }

    private async loadAllApps() {
        // Get app directories
        const appFolderNames = await this.getFolderNames('/data/apps');

        // Get apps within each app directory
        const appPaths: string[] = [];
        for (const appFolderName of appFolderNames) {
            const fileNames = await this.getFileNames(`/data/apps/${appFolderName}`);
            if (fileNames.length > 0) {
                for (const fileName of fileNames) {
                    appPaths.push(`/data/apps/${appFolderName}/${fileName}`);
                }
            }
        }

        // Load apps
        const apps: App[] = [];
        for (const appPath of appPaths) {
            const app = await this.loadFile(appPath);
            apps.push(app as App);
        }

        return apps;
    }

    private async loadAllCategories() {
        // Get category names
        const categoryNames = await this.getFileNames('/data/categories');

        // Load categories
        const categories: Category[] = [];
        for (const categoryName of categoryNames) {
            const category = await this.loadFile(`/data/categories/${categoryName}`);
            categories.push(category as Category);
        }

        return categories;
    }

    private getFolderNames(path: string): Promise<string[]> {
        return this.getDirectories(directoryPath + path);
    }

    private getFileNames(path: string): Promise<string[]> {
        return this.getFiles(directoryPath + path);
    }

    private async loadFile(path: string): Promise<any> {
        const file = await readFile(directoryPath + path, 'utf8');
        return toml.parse(file);
    }

    private async getDirectories(source: any): Promise<string[]> {
        return (await readdir(source, { withFileTypes: true }))
            .filter((dirent: { isDirectory: () => any; }) => dirent.isDirectory())
            .map((dirent: { name: any; }) => dirent.name);
    }

    private async getFiles(source: any): Promise<string[]> {
        return (await readdir(source, { withFileTypes: true }))
            .filter((dirent: { isDirectory: () => any; }) => !dirent.isDirectory())
            .map((dirent: { name: any; }) => dirent.name);
    }
}

(async () => {
    // Create data builder
    const builder = await DataBuilder
        .create()
        .build();

    // Save file
    await builder.save();
})();