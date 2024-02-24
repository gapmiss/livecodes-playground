/**
 * https://github.com/denolehov/obsidian-git/blob/master/src/setting/localStorageSettings.ts
 */
import {App} from "obsidian";
export class LocalStorageSettings {
	private prefix: string;
	constructor(private readonly plugin: { app: App, manifest: { id: string; }; }) {
		this.prefix = this.plugin.manifest.id + ":";
	}

	migrate(): void {
		const keys = [
			"count",
		];
		for (const key of keys) {
			const old = localStorage.getItem(this.prefix + key);
			if (
				this.plugin.app.loadLocalStorage(this.prefix + key) == null &&
				old != null
			) {
				if (old != null) {
					this.plugin.app.saveLocalStorage(this.prefix + key, old);
					localStorage.removeItem(this.prefix + key);
				}
			}
		}
	}

	getCount(): string | null {
		return this.plugin.app.loadLocalStorage(this.prefix + "count");
	}

	setCount(value: string): void {
		return this.plugin.app.saveLocalStorage(this.prefix + "count", value);
	}

	/*/
	getPATHPaths(): string[] {
	 return (
			this.plugin.app.loadLocalStorage(this.prefix + "PATHPaths")?.split(":") ?? []
		);
	}

	setPATHPaths(value: string[]): void {
		return this.plugin.app.saveLocalStorage(this.prefix + "PATHPaths", value.join(":"));
	}

	getEnvVars(): string[] {
		return JSON.parse(
			this.plugin.app.loadLocalStorage(this.prefix + "envVars") ?? "[]"
		);
	}

	setEnvVars(value: string[]): void {
		return this.plugin.app.saveLocalStorage(
			this.prefix + "envVars",
			JSON.stringify(value)
		);
	}

	getPluginDisabled(): boolean {
		return this.plugin.app.loadLocalStorage(this.prefix + "pluginDisabled") == "true";
	}

	setPluginDisabled(value: boolean): void {
		return this.plugin.app.saveLocalStorage(this.prefix + "pluginDisabled", `${value}`);
	}
	/**/
}

declare module "obsidian" {
	interface App {
		loadLocalStorage(key: string): string | null;
		saveLocalStorage(key: string, value: string | undefined): void;
	}
}