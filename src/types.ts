export interface Parameters {
	tplPath: string;
	// template?: string;	
	/*/
	workspace?: string;
	filepath?: string;
	daily?: "true";
	data?: string;
	mode?: "overwrite" | "append" | "prepend" | "new";
	heading?: string;
	block?: string;
	commandname?: string;
	commandid?: string;
	search?: string;
	searchregex?: string;
	replace?: string;
	uid?: string;
	filename?: string;
	exists?: string;
	viewmode?: "source" | "preview" | "live";
	openmode?: OpenMode;
	settingid?: string;
	settingsection?: string;
	"x-success"?: string;
	"x-error"?: string;
	saveworkspace?: "true";
	updateplugins?: "true";
	line?: number;
	/**/
	/**
	 * @deprecated Use "openMode" instead
	 */
	/*/
	newpane?: "true" | "false";
	clipboard?: "true";
	"enable-plugin"?: string;
	"disable-plugin"?: string;
	frontmatterkey?: string;
	eval?: string;
	bookmark?: string;
	/**/
}