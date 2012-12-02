.PHONY: reinstall clean serve servejs soyweb install serve_both test

PLOVR_JAR = node_modules/plovr/lib/plovr.jar
PLOVR_CONFIG = plovr.js

install: $(PLOVR_JAR)
$(PLOVR_JAR):
	npm install

soyweb: | $(PLOVR_JAR)
	java -jar $(PLOVR_JAR) soyweb --dir .
servejs: | $(PLOVR_JAR)
	java -jar $(PLOVR_JAR) serve $(PLOVR_CONFIG)
serve_both: soyweb servejs
serve:
	$(MAKE) -j serve_both

# Untested except on OSX...
OPEN = $(shell which open || which gnome-open || which exo-open || which kde-open)
test:
	@ if [ -z "$(OPEN)" ]; then echo 'No open equivalent found; open these in browser:'; echo 'http://localhost:9810/test/rep/all'; find . -name *_test.soy | sed 's/\./http:\/\/localhost:9811/' | sed 's/\.soy$$/.html/'; exit 1; fi
	$(OPEN) "http://localhost:9810/test/rep/all"
	find . -name *_test.soy | sed 's/\./http:\/\/localhost:9811/' | sed 's/\.soy$$/.html/' | xargs $(OPEN)

docs: clean_docs | $(PLOVR_JAR)
	java -jar $(PLOVR_JAR) jsdoc $(PLOVR_CONFIG)

clean_docs:
	rm -rf docs
clean: clean_docs
	rm -rf node_modules

reinstall: clean $(PLOVR_JAR)
