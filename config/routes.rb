Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      get 'weather_datas/index'
    end
  end

  root 'weather_reports#show'

  get 'weather_reports/show'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
