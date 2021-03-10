FROM thesis:development

RUN chmod +x docker/app/entrypoints/express.sh

EXPOSE 3000

CMD ["node", "./bin/www"]