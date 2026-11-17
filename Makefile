build-test:
	docker build -t bigarelli/adhd-manager-frontend .

publish-test:
	docker push bigarelli/adhd-manager-frontend
