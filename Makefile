# Project variables.
PROJECT = cn
JS_OUTPUT = cargo-not-min.js
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
		--compiler_flags "--js=$(LIB_PATH)/closure/goog/deps.js"

debug:
	py/index.py `$(CC) --output_mode list` > $(INDEX_OUTPUT)

release:
	$(CC) --compiler_flags "--compilation_level=ADVANCED_OPTIMIZATIONS" \
		--output_mode compiled > $(JS_OUTPUT)
	py/index.py $(JS_OUTPUT) > $(INDEX_OUTPUT)

dry-run:
	$(CC) --output_mode compiled > /dev/null

lint:
	gjslint --strict --unix_mode -r $(PROJECT) \
		--exclude_files $(PROJECT)/leveldata.js

clean:
	rm -f $(JS_OUTPUT) $(INDEX_OUTPUT)

server:
	python -m SimpleHTTPServer

closure: closure-library closure-compiler

closure-library:
	svn checkout $(LIB_URL) $(LIB_PATH)

closure-compiler:
	wget $(CC_URL) -O /tmp/cc.zip
	unzip -o /tmp/cc.zip -d $(CC_PATH)
