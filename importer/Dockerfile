FROM ruby

COPY Gemfile /
RUN bundle install
COPY import_transactions_bulk.rb /
COPY mongoid.yml /

CMD [ "/import_transactions_bulk.rb" ]