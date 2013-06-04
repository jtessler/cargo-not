# Project variables.
PROJECT = cn
JS_OUTPUT = cargo-not-min.js
CSS_OUTPUT = cargo-not-min.css
JS_MAP_OUTPUT = cargo-not-map.js
INDEX_OUTPUT = index.html

# Closure Library variables.
LIB_URL = http://closure-library.googlecode.com/svn/trunk/
LIB_PATH = closure/library

# Closure Compiler variables.
CC_URL = http://closure-compiler.googlecode.com/files/compiler-latest.zip
CC_PATH = closure/compiler
CC_JAR = $(CC_PATH)/compiler.jar

# Closure closurebuilder.py arguments.
CC = $(LIB_PATH)/closure/bin/build/closurebuilder.py \
		--root $(LIB_PATH) \
		--root $(PROJECT)/ \
		--namespace "$(PROJECT)" \
		--compiler_jar $(CC_JAR) \
		--compiler_flags "--jscomp_error=accessControls" \
		--compiler_flags "--jscomp_error=const" \
		--compiler_flags "--warning_level=VERBOSE" \
		--compiler_flags "--js=$(JS_MAP_OUTPUT)" \
		--compiler_flags "--js=$(LIB_PATH)/closure/goog/deps.js"

# Closure Stylesheets variables.
CSS_URL = https://closure-stylesheets.googlecode.com/files/closure-stylesheets-20111230.jar
CSS_JAR = closure/closure-stylesheets.jar

# Closure Stylesheets arguments.
CSS = java -jar $(CSS_JAR) `find gss -name *.gss` \
		--output-file $(CSS_OUTPUT)

debug: css-debug
	py/index.py $(CSS_OUTPUT) $(JS_MAP_OUTPUT) `$(CC) --output_mode list` > \
		$(INDEX_OUTPUT)

release: css-release
	$(CC) \
		--compiler_flags "--compilation_level=ADVANCED_OPTIMIZATIONS" \
		--output_mode compiled > $(JS_OUTPUT)
	py/index.py $(CSS_OUTPUT) $(JS_OUTPUT) > $(INDEX_OUTPUT)

# Update the ROOT constant when compiling on a UTCS machine.
release-utcs: css-release
	$(CC) \
		--compiler_flags "--define=\"cn.constants.ROOT='/~joseph/cargo-not/'\"" \
		--compiler_flags "--compilation_level=ADVANCED_OPTIMIZATIONS" \
		--output_mode compiled > $(JS_OUTPUT)
	py/index.py $(CSS_OUTPUT) $(JS_OUTPUT) > $(INDEX_OUTPUT)

css-release:
	$(CSS) \
		--rename CLOSURE \
		--output-renaming-map-format CLOSURE_COMPILED \
		--output-renaming-map $(JS_MAP_OUTPUT) \

css-debug:
	$(CSS) \
		--pretty-print \
		--rename DEBUG \
		--output-renaming-map-format CLOSURE_UNCOMPILED \
		--output-renaming-map $(JS_MAP_OUTPUT) \

dry-run:
	$(CC) --output_mode compiled > /dev/null

lint:
	gjslint --strict --unix_mode -r $(PROJECT)

clean:
	rm -f $(JS_OUTPUT) $(CSS_OUTPUT) $(JS_MAP_OUTPUT) $(INDEX_OUTPUT)

server:
	python -m SimpleHTTPServer

closure: closure-library closure-compiler closure-stylesheets

closure-library:
	svn checkout $(LIB_URL) $(LIB_PATH)

closure-compiler:
	wget $(CC_URL) -O /tmp/cc.zip
	unzip -o /tmp/cc.zip -d $(CC_PATH)

closure-stylesheets:
	wget $(CSS_URL) -O $(CSS_JAR)
