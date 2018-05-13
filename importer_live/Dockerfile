FROM ruby

COPY Gemfile /
RUN bundle install
COPY import_transactions.rb /
COPY mongoid.yml /

CMD [ "/import_transactions.rb" ]