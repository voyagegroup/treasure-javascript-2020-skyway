deploy:
	rm -rf dist && webpack --mode production &&
	git branch gh-pages && 
	git add dist &&
	git commit -m "$m" &&
	git subtree push --prefix dist origin gh-pages