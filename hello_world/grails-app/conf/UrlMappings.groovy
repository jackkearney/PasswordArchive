class UrlMappings {

    static excludes = ['ssb/app.js']

	static mappings = {

        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        // doesn't work.. messes up path to resources?
        "/" {
            controller = "hello"
            action = "red"
        }
        "500"(view:'/error')
	}
}
