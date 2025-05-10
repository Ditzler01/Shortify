export type UrlObject = {
  redirect_url: string,
  shortened_url: string,
  slug: string,
  expiration_date?: string
}

export type UrlReturnType = {
  id: string,
  created_at: string
} & UrlObject