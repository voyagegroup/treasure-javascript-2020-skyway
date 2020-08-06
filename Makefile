deploy:
	yarn run build 
	git add dist 
	git commit -m "$m" 
	git subtree split --prefix dist -b gh-pages
	git push -f origin gh-pages:gh-pages
	git branch -D gh-pages
	rm -rf dist
	git reset --hard HEAD~