deploy:
	git branch gh-pages && 
	git add dist &&
	git commit -m "$m" &&
	git subtree push --prefix dist origin gh-pages