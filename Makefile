# Project variables.
PROJECT = cargo
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
		--namespace "$(PROJECT).base" \
		--compiler_jar $(CC_JAR) \
		--compiler_flags "--jscomp_error=accessControls" \
		--compiler_flags "--jscomp_error=const" \
		--compiler_flags "--warning_level=VERBOSE" \
		--compiler_flags "--js=$(LIB_PATH)/closure/goog/deps.js"

debug:
	py/index.py `$(CC) --output_mode list` > $(INDEX_OUTPUT)

release:
	$(CC) --output_mode compiled > $(JS_OUTPUT)
	py/index.py $(JS_OUTPUT) > $(INDEX_OUTPUT)

dry-run:
	$(CC) --output_mode compiled > /dev/null

lint:
	gjslint --exclude_files $(SHADER_OUTPUT),$(OBJ_OUTPUT) \
		--unix_mode -r cidev/

clean:
	rm -f $(JS_OUTPUT)

server:
	python -m SimpleHTTPServer

closure: closure-library closure-compiler

closure-library:
	svn checkout $(LIB_URL) $(LIB_PATH)

closure-compiler:
	wget $(CC_URL) -O /tmp/cc.zip
	unzip -o /tmp/cc.zip -d $(CC_PATH)
