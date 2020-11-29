keypair:
	ssh-keygen -t rsa -b 1024 -m pem -N "" -f ${PWD}/id_rsa
	ssh-keygen -e -m PKCS8 -f ${PWD}/id_rsa.pub > ${PWD}/id_rsa_conv.pub
	rm ${PWD}/id_rsa.pub
	mv ${PWD}/id_rsa_conv.pub ${PWD}/id_rsa.pub

clean:
	-rm ${PWD}/id_rsa
	rm ${PWD}/id_rsa.pub

curl_login:
	curl -X POST http://localhost:5000/shopListLogin -H "Content-Type: application/json" -H "Accept: application/json" -d '{"name": "Philipp", "pwd": "secret1"}'

curl_get_list:
	curl -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGhpbGlwcCIsImV4cCI6MTU4NDM1NDM2NSwiaWF0IjoxNTg0MjY3OTY1fQ.TJ3OMpHTDbCJqhCM2yqgO39C9cLJ8rehB1G1bFlm-kLp-mKrh1qLFum59uQ6S-2gWzd9ivKne3RcOEAxx0EjmAOFQRwLWf-Ewj0ba6ZLDScOOMXGHUk0AyMDWRFQsZhiDqKWiEUVG3JyYsjUiY0bo_wQ6f75Z_rwKt5sLF3Ka54" http://localhost:5000/shopList

curl_get_list_notoken:
	curl -H 'Accept: application/json' http://localhost:5000/shopList